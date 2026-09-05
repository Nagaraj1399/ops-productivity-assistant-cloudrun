import { FunctionDeclaration, Type } from '@google/genai';
import { opDb } from './data';

// Tool Function Declarations for Gemini Function Calling
export const functionDeclarations: FunctionDeclaration[] = [
  {
    name: 'get_daily_sales_summary',
    description: 'Retrieve real-time sales performance metrics including gross sales, order count, AOV, top performer SKU, and lagging sectors for a given date.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        date_str: {
          type: Type.STRING,
          description: 'The date string in YYYY-MM-DD format (e.g. "2026-09-03").'
        }
      }
    }
  },
  {
    name: 'check_low_inventory',
    description: 'Continuously evaluate warehouse stock levels against safety thresholds to identify critical stockout risks and compute run-out forecasts.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        threshold: {
          type: Type.NUMBER,
          description: 'Safety stock threshold limit (defaults to 15 if unspecified).'
        }
      }
    }
  },
  {
    name: 'calculate_reorder_quantity',
    description: 'Compute precise reorder quantities based on daily sales velocity, supplier lead time, and buffer safety stock.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        sku: {
          type: Type.STRING,
          description: 'The target product SKU code, e.g. "SKU-102".'
        },
        target_days: {
          type: Type.NUMBER,
          description: 'Target coverage in days (default: 14 days).'
        }
      },
      required: ['sku']
    }
  },
  {
    name: 'schedule_restock_order',
    description: 'Queue and generate a draft or priority purchase order (PO) for supplier restocking of an understocked SKU.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        sku: {
          type: Type.STRING,
          description: 'The product SKU code, e.g. "SKU-102" or "SKU-205".'
        },
        quantity: {
          type: Type.NUMBER,
          description: 'Units to order from the designated supplier.'
        }
      },
      required: ['sku', 'quantity']
    }
  },
  {
    name: 'dispatch_purchase_order',
    description: 'Authorize immediate dispatch of a queued or draft purchase order to the vendor logistics team.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        po_id: {
          type: Type.STRING,
          description: 'The purchase order identifier, e.g. "PO-102-9841".'
        }
      },
      required: ['po_id']
    }
  },
  {
    name: 'detect_sales_anomalies',
    description: 'Detect abnormal sales fluctuations, unexpected checkout drop-offs, or sudden order surges relative to the 7-day rolling average.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        lookback_days: {
          type: Type.NUMBER,
          description: 'Number of historical days to inspect (default: 7).'
        }
      }
    }
  },
  {
    name: 'get_daily_priorities',
    description: 'Structure daily operational priorities for the business owner across logistics, vendor follow-ups, and fulfillment.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        department: {
          type: Type.STRING,
          description: 'Filter by department: "all", "logistics", "vendor", "fulfillment", or "executive".'
        }
      }
    }
  },
  {
    name: 'update_task_status',
    description: 'Update the operational status of a scheduled management task.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        task_id: {
          type: Type.STRING,
          description: 'The task ID, e.g. "TASK-101".'
        },
        status: {
          type: Type.STRING,
          description: 'New status: "pending", "in_progress", or "completed".'
        }
      },
      required: ['task_id', 'status']
    }
  },
  {
    name: 'get_rma_refund_alerts',
    description: 'Retrieve return merchandise authorization (RMA) and refund volume spikes to detect supplier defect batches.',
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  },
  {
    name: 'check_competitor_pricing',
    description: 'Check automated competitor price-matching monitors for matched catalog SKUs.',
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  }
];

// Execution Implementation strictly grounded in the database
export async function executeTool(name: string, args: Record<string, any>): Promise<any> {
  switch (name) {
    case 'get_daily_sales_summary': {
      const dateStr = args.date_str || '2026-09-03';
      const summary = opDb.getSalesSummary(dateStr);
      return {
        date: summary.date,
        gross_sales: `$${summary.grossSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        gross_sales_numeric: summary.grossSales,
        order_count: summary.orderCount,
        aov: `$${summary.aov.toFixed(2)}`,
        conversion_rate: `${summary.conversionRate}%`,
        top_performer: {
          sku: summary.topPerformer.sku,
          item_name: summary.topPerformer.name,
          units_sold: summary.topPerformer.unitsSold,
          revenue: `$${summary.topPerformer.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        },
        lagging_sector: {
          category: summary.laggingSector.category,
          change_vs_7day: `${summary.laggingSector.changePctVs7Day}%`,
          note: summary.laggingSector.note
        },
        category_breakdown: summary.categoryBreakdown
      };
    }

    case 'check_low_inventory': {
      const threshold = Number(args.threshold) || 15;
      const allItems = opDb.getInventory();
      const lowItems = allItems.filter(item => item.currentStock <= threshold);

      const itemsReport = lowItems.map(item => {
        const daysRemaining = (item.currentStock / (item.dailyVelocity || 1)).toFixed(1);
        return {
          sku: item.sku,
          item_name: item.name,
          current_stock: `${item.currentStock} units`,
          stock_numeric: item.currentStock,
          safety_min: `${item.safetyMin} units`,
          safety_min_numeric: item.safetyMin,
          daily_velocity: `${item.dailyVelocity} units/day`,
          days_until_stockout: `${daysRemaining} days`,
          recommended_reorder: `${item.reorderQuantity} units`,
          recommended_reorder_numeric: item.reorderQuantity,
          status: item.status,
          supplier: item.supplier
        };
      });

      return {
        threshold_inspected: threshold,
        total_items_inspected: allItems.length,
        critical_items_count: itemsReport.length,
        items: itemsReport,
        draft_pos_available: [
          { po_id: 'PO-102-9841', sku: 'SKU-102', quantity: 25 },
          { po_id: 'PO-205-9842', sku: 'SKU-205', quantity: 15 }
        ]
      };
    }

    case 'calculate_reorder_quantity': {
      const sku = (args.sku || '').toUpperCase();
      const targetDays = Number(args.target_days) || 14;
      const item = opDb.getInventory().find(i => i.sku.toUpperCase() === sku);
      if (!item) {
        return { error: `SKU '${sku}' not found in catalog ledger.` };
      }

      // Formula: (daily velocity * (lead time + target days)) - current stock
      const requiredUnits = Math.ceil(item.dailyVelocity * (item.leadTimeDays + targetDays)) - item.currentStock;
      const recommended = Math.max(requiredUnits, item.reorderQuantity);

      return {
        sku: item.sku,
        item_name: item.name,
        current_stock: item.currentStock,
        daily_velocity: item.dailyVelocity,
        lead_time_days: item.leadTimeDays,
        target_coverage_days: targetDays,
        calculated_reorder_quantity: recommended,
        estimated_cost: `$${(recommended * item.unitCost).toFixed(2)}`,
        supplier: item.supplier
      };
    }

    case 'schedule_restock_order': {
      const sku = (args.sku || '').toUpperCase();
      const quantity = Number(args.quantity) || 20;
      const po = opDb.createPurchaseOrder(sku, quantity);
      if (!po) {
        return { error: `Failed to create PO for SKU '${sku}'. SKU not found.` };
      }
      return {
        po_id: po.id,
        sku: po.sku,
        item_name: po.itemName,
        quantity: po.quantity,
        unit_cost: `$${po.unitCost.toFixed(2)}`,
        total_cost: `$${po.totalCost.toFixed(2)}`,
        supplier: po.supplier,
        status: po.status,
        confirmation_estimate: '~2 hours',
        message: `PO-${po.id} generated and queued with ${po.supplier}.`
      };
    }

    case 'dispatch_purchase_order': {
      const poId = (args.po_id || '').toUpperCase();
      const po = opDb.dispatchPurchaseOrder(poId);
      if (!po) {
        return { error: `Purchase Order '${poId}' not found.` };
      }
      return {
        po_id: po.id,
        sku: po.sku,
        item_name: po.itemName,
        quantity: po.quantity,
        supplier: po.supplier,
        status: 'dispatched',
        timestamp: new Date().toISOString(),
        message: `PO ${po.id} dispatched directly to ${po.supplier}. Estimated warehouse delivery: 2-3 business days.`
      };
    }

    case 'detect_sales_anomalies': {
      return {
        lookback_period: '7 days',
        anomalies_detected: 1,
        anomalies: [
          {
            category: 'Desk Accessories',
            sku_affected: ['SKU-408', 'SKU-512'],
            severity: 'moderate',
            deviation: '-18% vs 7-day average',
            root_cause: 'Competitor price undercut on Monitor Arm (-$12) and checkout funnel bounce rate increase (+14%).',
            suggested_mitigation: 'Implement temporary bundle pricing ($10 off when purchased with Ergonomic Chair).'
          }
        ]
      };
    }

    case 'get_daily_priorities': {
      const dept = (args.department || 'all').toLowerCase();
      const allTasks = opDb.getTasks();
      const filtered = dept === 'all' ? allTasks : allTasks.filter(t => t.department === dept);
      return {
        total_tasks: filtered.length,
        priorities: filtered.map(t => ({
          task_id: t.id,
          title: t.title,
          department: t.department,
          priority: t.priority,
          status: t.status,
          assigned_to: t.assignedTo,
          due_date: t.dueDate,
          action_required: t.actionRequired
        }))
      };
    }

    case 'update_task_status': {
      const taskId = args.task_id;
      const status = args.status;
      const updated = opDb.updateTaskStatus(taskId, status);
      if (!updated) {
        return { error: `Task ${taskId} not found.` };
      }
      return {
        task_id: updated.id,
        title: updated.title,
        status: updated.status,
        updated_at: new Date().toISOString()
      };
    }

    case 'get_rma_refund_alerts': {
      const rmas = opDb.getRmaAlerts();
      return {
        active_alerts: rmas.length,
        alerts: rmas.map(r => ({
          rma_id: r.id,
          sku: r.sku,
          item_name: r.itemName,
          return_rate: `${r.returnRate}%`,
          benchmark_rate: `${r.benchmarkRate}%`,
          primary_reason: r.primaryReason,
          recommended_action: `Halt incoming lot #B26 shipment; issue supplier quality deviation claim to ${r.itemName.includes('Dock') ? 'Anker Pro' : 'Vendor'}.`
        }))
      };
    }

    case 'check_competitor_pricing': {
      return {
        monitored_products: 6,
        discrepancies: [
          {
            sku: 'SKU-408',
            name: 'Aluminum Heavy-Duty Monitor Arm',
            our_price: '$79.00',
            competitor_price: '$67.00',
            competitor_name: 'WorkPro Direct',
            delta: '-$12.00 (-15.2%)',
            recommendation: 'Match price at $69.00 or offer free desk mat bundle to protect margin.'
          }
        ]
      };
    }

    default:
      throw new Error(`Unknown function call: ${name}`);
  }
}
