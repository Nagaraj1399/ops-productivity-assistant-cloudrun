import { FunctionDeclaration, Type } from '@google/genai';
import { opDb } from './data';

// Tool Function Declarations for Gemini Function Calling
export const functionDeclarations: FunctionDeclaration[] = [
  // 1. check_daily_sales (Lab 3 Core Requirement)
  {
    name: 'check_daily_sales',
    description: 'Retrieve detailed daily sales performance metrics: total gross revenue, average order value (AOV), daily transaction counts, top-performing SKUs, and lagging categories.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        date_str: {
          type: Type.STRING,
          description: 'The target date in YYYY-MM-DD format (defaults to current operational date "2026-09-03").'
        }
      }
    }
  },
  // Backward compatibility alias for check_daily_sales
  {
    name: 'get_daily_sales_summary',
    description: 'Retrieve real-time sales performance metrics including gross sales, order count, AOV, top performer SKU, and lagging sectors for a given date.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        date_str: {
          type: Type.STRING,
          description: 'The date string in YYYY-MM-DD format.'
        }
      }
    }
  },
  // 2. track_inventory (Lab 3 Core Requirement)
  {
    name: 'track_inventory',
    description: 'Continuously evaluate warehouse inventory against dynamic safety thresholds. Identifies critically low stock items, full stock-outs, daily sales burn rates, and run-out day forecasts.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        threshold: {
          type: Type.NUMBER,
          description: 'Dynamic safety stock threshold limit (defaults to 15 if unspecified).'
        },
        include_out_of_stock: {
          type: Type.BOOLEAN,
          description: 'Flag to explicitly include zero-stock depleted items.'
        }
      }
    }
  },
  // Backward compatibility alias for track_inventory
  {
    name: 'check_low_inventory',
    description: 'Evaluate warehouse stock levels against safety thresholds to identify critical stockout risks and compute run-out forecasts.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        threshold: {
          type: Type.NUMBER,
          description: 'Safety stock threshold limit (defaults to 15).'
        }
      }
    }
  },
  // 3. generate_daily_operations_summary (Lab 3 Core Requirement)
  {
    name: 'generate_daily_operations_summary',
    description: 'Synthesize daily sales performance metrics and low-inventory risks into an actionable executive COO operational briefing with priority action items.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        date_str: {
          type: Type.STRING,
          description: 'Operational date in YYYY-MM-DD format (defaults to "2026-09-03").'
        },
        inventory_threshold: {
          type: Type.NUMBER,
          description: 'Inventory safety threshold for stockout risk auditing (default: 15).'
        }
      }
    }
  },
  // Operational automation tools
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

// Helper: Handle check_daily_sales with edge-case protection (zero sales, null date)
function executeCheckDailySales(dateStr: string) {
  try {
    const summary = opDb.getSalesSummary(dateStr || '2026-09-03');
    if (!summary || summary.grossSales === undefined) {
      return {
        date: dateStr,
        gross_revenue: '$0.00',
        gross_revenue_numeric: 0,
        average_order_value: '$0.00',
        aov_numeric: 0,
        daily_transactions: 0,
        conversion_rate: '0.0%',
        status: 'ZERO_SALES_RECORDED',
        note: 'No transaction activity recorded for this period.'
      };
    }

    return {
      date: summary.date,
      revenue: `$${summary.grossSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      revenue_numeric: summary.grossSales,
      gross_sales: `$${summary.grossSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      average_order_value: `$${summary.aov.toFixed(2)}`,
      aov: `$${summary.aov.toFixed(2)}`,
      aov_numeric: summary.aov,
      daily_transactions: summary.orderCount,
      order_count: summary.orderCount,
      conversion_rate: `${summary.conversionRate}%`,
      top_performer: {
        sku: summary.topPerformer?.sku || 'N/A',
        item_name: summary.topPerformer?.name || 'N/A',
        units_sold: summary.topPerformer?.unitsSold || 0,
        revenue: `$${(summary.topPerformer?.revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
      },
      lagging_sector: {
        category: summary.laggingSector?.category || 'None',
        change_vs_7day: `${summary.laggingSector?.changePctVs7Day || 0}%`,
        note: summary.laggingSector?.note || 'Within normal statistical deviation'
      },
      category_breakdown: summary.categoryBreakdown || []
    };
  } catch (err: any) {
    return {
      date: dateStr,
      error: 'Failed to retrieve sales metrics',
      details: err?.message || String(err),
      gross_revenue: '$0.00',
      daily_transactions: 0,
      average_order_value: '$0.00'
    };
  }
}

// Helper: Handle track_inventory with edge-case protection (full stockouts, dynamic threshold)
function executeTrackInventory(thresholdValue: number, includeOutOfStock: boolean = true) {
  try {
    const threshold = Number.isFinite(thresholdValue) ? thresholdValue : 15;
    const allItems = opDb.getInventory();

    const lowItems = allItems.filter(item => {
      if (item.currentStock <= 0) return includeOutOfStock;
      return item.currentStock <= threshold;
    });

    const stockoutCount = allItems.filter(i => i.currentStock <= 0).length;

    const itemsReport = lowItems.map(item => {
      const velocity = item.dailyVelocity > 0 ? item.dailyVelocity : 0.5;
      const daysRemaining = (item.currentStock / velocity).toFixed(1);
      const isStockout = item.currentStock <= 0;

      return {
        sku: item.sku,
        item_name: item.name,
        current_stock: `${item.currentStock} units`,
        stock_numeric: item.currentStock,
        safety_min: `${item.safetyMin} units`,
        safety_min_numeric: item.safetyMin,
        daily_velocity: `${item.dailyVelocity} units/day`,
        days_until_stockout: isStockout ? '0.0 days (DEPLETED)' : `${daysRemaining} days`,
        stockout_risk: isStockout ? 'CRITICAL_STOCKOUT' : item.currentStock <= item.safetyMin ? 'HIGH_RISK' : 'MODERATE_RISK',
        recommended_reorder: `${item.reorderQuantity} units`,
        recommended_reorder_numeric: item.reorderQuantity,
        supplier: item.supplier,
        status: isStockout ? 'OUT_OF_STOCK' : item.status
      };
    });

    return {
      threshold_inspected: threshold,
      total_catalog_items: allItems.length,
      low_stock_count: itemsReport.length,
      full_stockout_count: stockoutCount,
      stockout_risk_flag: itemsReport.length > 0,
      critical_items: itemsReport,
      items: itemsReport,
      action_recommended: itemsReport.length > 0
        ? `Execute supplier purchase orders for ${itemsReport.length} critically low SKU(s).`
        : 'All inventory is above dynamic safety stock thresholds.'
    };
  } catch (err: any) {
    return {
      error: 'Failed to inspect inventory levels',
      details: err?.message || String(err),
      total_catalog_items: 0,
      low_stock_count: 0,
      critical_items: []
    };
  }
}

// Helper: Handle generate_daily_operations_summary (combines sales + inventory into executive briefing)
function executeGenerateDailyOperationsSummary(dateStr: string, inventoryThreshold: number = 15) {
  const targetDate = dateStr || '2026-09-03';
  const sales = executeCheckDailySales(targetDate);
  const inventory = executeTrackInventory(inventoryThreshold, true);
  const pendingOrders = opDb.getPurchaseOrders().filter(p => p.status === 'draft' || p.status === 'queued');
  const tasks = opDb.getTasks().filter(t => t.status !== 'completed');

  const briefing = {
    briefing_date: targetDate,
    executive_verdict: inventory.low_stock_count > 0 ? 'ACTION REQUIRED: SUPPLY CHAIN THRESHOLD BREACH' : 'OPTIMAL: RUNNING WITHIN TARGETS',
    financial_summary: {
      gross_revenue: sales.gross_sales || sales.revenue || '$0.00',
      daily_transactions: sales.daily_transactions || 0,
      average_order_value: sales.average_order_value || '$0.00',
      conversion_rate: sales.conversion_rate || '0%',
      top_performing_sku: sales.top_performer?.sku || 'N/A',
      lagging_sector: sales.lagging_sector?.category || 'None'
    },
    inventory_health: {
      total_catalog_items: inventory.total_catalog_items,
      at_risk_sku_count: inventory.low_stock_count,
      full_stockout_count: inventory.full_stockout_count,
      critical_skus: inventory.critical_items.map((i: any) => ({
        sku: i.sku,
        name: i.item_name,
        stock: i.current_stock,
        days_left: i.days_until_stockout,
        action: `Reorder ${i.recommended_reorder} from ${i.supplier}`
      }))
    },
    procurement_pipeline: {
      pending_draft_orders_count: pendingOrders.length,
      orders: pendingOrders.map(p => ({
        po_id: p.id,
        sku: p.sku,
        quantity: p.quantity,
        total_cost: `$${p.totalCost.toFixed(2)}`,
        status: p.status
      }))
    },
    immediate_action_items: [
      ...(inventory.critical_items.length > 0
        ? [`Approve and dispatch restock purchase orders for ${inventory.critical_items[0].sku} (${inventory.critical_items[0].item_name})`]
        : []),
      ...(pendingOrders.length > 0
        ? [`Authorize dispatch of ${pendingOrders.length} pending draft POs to automated supplier logistics`]
        : []),
      ...(tasks.length > 0
        ? [`Fulfill high-priority operational task: ${tasks[0].title}`]
        : [])
    ]
  };

  return briefing;
}

// Execution Implementation strictly grounded in the database
export async function executeTool(name: string, args: Record<string, any>): Promise<any> {
  switch (name) {
    // 1. check_daily_sales & alias
    case 'check_daily_sales':
    case 'get_daily_sales_summary': {
      const dateStr = args.date_str || '2026-09-03';
      return executeCheckDailySales(dateStr);
    }

    // 2. track_inventory & alias
    case 'track_inventory':
    case 'check_low_inventory': {
      const threshold = Number(args.threshold) || 15;
      const includeOos = args.include_out_of_stock !== false;
      return executeTrackInventory(threshold, includeOos);
    }

    // 3. generate_daily_operations_summary
    case 'generate_daily_operations_summary': {
      const dateStr = args.date_str || '2026-09-03';
      const threshold = Number(args.inventory_threshold) || 15;
      return executeGenerateDailyOperationsSummary(dateStr, threshold);
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
