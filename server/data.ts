import { InventoryItem, PurchaseOrder, SalesSummary, OperationalTask, RmaAlert, OperationsState } from '../src/types';

// In-memory operational store with realistic ground-truth data grounded on 2026-09-03
class OperationalDatabase {
  private inventory: InventoryItem[] = [
    {
      sku: 'SKU-102',
      name: 'Wireless Mechanical Keyboard',
      category: 'Input Devices',
      currentStock: 4,
      safetyMin: 15,
      reorderQuantity: 25,
      unitCost: 52.00,
      retailPrice: 99.00,
      dailyVelocity: 6.2,
      leadTimeDays: 4,
      supplier: 'Apex Peripherals Co.',
      status: 'critical'
    },
    {
      sku: 'SKU-205',
      name: 'USB-C Dual Dock',
      category: 'Hubs & Connectivity',
      currentStock: 12,
      safetyMin: 15,
      reorderQuantity: 15,
      unitCost: 45.00,
      retailPrice: 89.00,
      dailyVelocity: 4.8,
      leadTimeDays: 3,
      supplier: 'Anker Pro Supplies',
      status: 'low'
    },
    {
      sku: 'SKU-310',
      name: 'Ergonomic Office Chair',
      category: 'Furniture & Seating',
      currentStock: 48,
      safetyMin: 20,
      reorderQuantity: 30,
      unitCost: 180.00,
      retailPrice: 389.00,
      dailyVelocity: 11.4,
      leadTimeDays: 7,
      supplier: 'Kinetics Seating Ltd.',
      status: 'nominal'
    },
    {
      sku: 'SKU-408',
      name: 'Aluminum Heavy-Duty Monitor Arm',
      category: 'Desk Accessories',
      currentStock: 38,
      safetyMin: 15,
      reorderQuantity: 20,
      unitCost: 38.00,
      retailPrice: 79.00,
      dailyVelocity: 3.1,
      leadTimeDays: 5,
      supplier: 'ErgoTech Direct',
      status: 'nominal'
    },
    {
      sku: 'SKU-512',
      name: 'Desk Mat Pro (Felt & Vegan Leather)',
      category: 'Desk Accessories',
      currentStock: 64,
      safetyMin: 25,
      reorderQuantity: 40,
      unitCost: 11.00,
      retailPrice: 29.00,
      dailyVelocity: 5.5,
      leadTimeDays: 3,
      supplier: 'Artisan Workspace',
      status: 'nominal'
    },
    {
      sku: 'SKU-601',
      name: 'Noise-Canceling Wireless Headset',
      category: 'Audio',
      currentStock: 29,
      safetyMin: 12,
      reorderQuantity: 20,
      unitCost: 74.00,
      retailPrice: 149.00,
      dailyVelocity: 3.8,
      leadTimeDays: 4,
      supplier: 'Acoustics Global',
      status: 'nominal'
    }
  ];

  private purchaseOrders: PurchaseOrder[] = [
    {
      id: 'PO-205-3605',
      sku: 'SKU-205',
      itemName: 'Wireless Mechanical Keyboard',
      quantity: 25,
      unitCost: 5.40,
      totalCost: 135.00,
      supplier: 'Vendor Logistics Node',
      status: 'draft',
      createdAt: '2026-09-03 01:15:00',
      estimatedDelivery: '2 business days'
    },
    {
      id: 'PO-102-9841',
      sku: 'SKU-102',
      itemName: 'USB-C Dual Dock',
      quantity: 15,
      unitCost: 116.66,
      totalCost: 1750.00,
      supplier: 'Venogistics Supply',
      status: 'dispatched',
      createdAt: '2026-09-03 01:30:00',
      estimatedDelivery: '2 business days'
    },
    {
      id: 'PO-205-9842',
      sku: 'SKU-102',
      itemName: 'Wireless Mechanical Keyboard',
      quantity: 25,
      unitCost: 50.00,
      totalCost: 1250.00,
      supplier: 'Apex Peripherals Co.',
      status: 'dispatched',
      createdAt: '2026-09-03 01:35:00',
      estimatedDelivery: '3 business days'
    }
  ];

  private salesSummary: SalesSummary = {
    date: '2026-09-03',
    grossSales: 14250.00,
    orderCount: 138,
    aov: 103.26,
    conversionRate: 3.42,
    topPerformer: {
      sku: 'SKU-310',
      name: 'Ergonomic Office Chair',
      unitsSold: 34,
      revenue: 13226.00
    },
    laggingSector: {
      category: 'Desk Accessories',
      changePctVs7Day: -18,
      note: 'Volume drop on monitor arms and felt desk mats (-18% vs 7-day average). Traffic steady; checkout drop-off detected.'
    },
    categoryBreakdown: [
      { category: 'Furniture & Seating', revenue: 7650.00, unitsSold: 42, growthPct: 14.5 },
      { category: 'Input Devices', revenue: 3120.00, unitsSold: 35, growthPct: 4.2 },
      { category: 'Hubs & Connectivity', revenue: 1980.00, unitsSold: 28, growthPct: -2.1 },
      { category: 'Desk Accessories', revenue: 860.00, unitsSold: 18, growthPct: -18.0 },
      { category: 'Audio', revenue: 640.00, unitsSold: 15, growthPct: 1.8 }
    ],
    hourlySales: [
      { hour: '00:00', sales: 420, orders: 4 },
      { hour: '02:00', sales: 280, orders: 3 },
      { hour: '04:00', sales: 190, orders: 2 },
      { hour: '06:00', sales: 850, orders: 8 },
      { hour: '08:00', sales: 1840, orders: 17 },
      { hour: '10:00', sales: 2420, orders: 23 },
      { hour: '12:00', sales: 2150, orders: 21 },
      { hour: '14:00', sales: 1980, orders: 19 },
      { hour: '16:00', sales: 1740, orders: 17 },
      { hour: '18:00', sales: 1280, orders: 13 },
      { hour: '20:00', sales: 740, orders: 7 },
      { hour: '22:00', sales: 360, orders: 4 }
    ]
  };

  private tasks: OperationalTask[] = [
    {
      id: 'TASK-101',
      title: 'Authorize Draft POs for Low Stock SKUs (PO-102-9841 & PO-205-9842)',
      department: 'executive',
      priority: 'critical',
      status: 'pending',
      assignedTo: 'Chief Operating Officer',
      actionRequired: 'Dispatch purchase orders to Apex Peripherals & Anker Pro before 10:00 cut-off.',
      dueDate: '2026-09-03 10:00'
    },
    {
      id: 'TASK-102',
      title: 'Investigate Desk Accessories Lagging Volume (-18%)',
      department: 'fulfillment',
      priority: 'high',
      status: 'in_progress',
      assignedTo: 'E-commerce Growth Team',
      actionRequired: 'Audit product page bounce rate on Aluminum Monitor Arm and bundle promo discount.',
      dueDate: '2026-09-03 14:00'
    },
    {
      id: 'TASK-103',
      title: 'Inspect RMA Batch #412 USB-C Dock Return Spike (4.2% Return Rate)',
      department: 'vendor',
      priority: 'high',
      status: 'pending',
      assignedTo: 'QA Logistics',
      actionRequired: 'Test batch sample cables; flag manufacturer lot #B26 with Anker Pro.',
      dueDate: '2026-09-03 16:00'
    },
    {
      id: 'TASK-104',
      title: 'Audit Regional 3PL Delivery SLAs (West Warehouse)',
      department: 'logistics',
      priority: 'medium',
      status: 'pending',
      assignedTo: 'Logistics Lead',
      actionRequired: 'Hold review with FedEx Ground over 8.8% late delivery breach.',
      dueDate: '2026-09-04 11:00'
    }
  ];

  private rmaAlerts: RmaAlert[] = [
    {
      id: 'RMA-412',
      sku: 'SKU-205',
      itemName: 'USB-C Dual Dock',
      returnRate: 4.2,
      benchmarkRate: 1.1,
      primaryReason: 'Intermittent HDMI signal cutout on M3 chips (Lot #B26)',
      status: 'active'
    }
  ];

  // Getters
  public getInventory(): InventoryItem[] {
    return [...this.inventory];
  }

  public getPurchaseOrders(): PurchaseOrder[] {
    return [...this.purchaseOrders];
  }

  public getSalesSummary(dateStr?: string): SalesSummary {
    return { ...this.salesSummary, date: dateStr || this.salesSummary.date };
  }

  public getTasks(): OperationalTask[] {
    return [...this.tasks];
  }

  public getRmaAlerts(): RmaAlert[] {
    return [...this.rmaAlerts];
  }

  public getState(): OperationsState {
    return {
      inventory: this.getInventory(),
      purchaseOrders: this.getPurchaseOrders(),
      salesSummary: this.getSalesSummary(),
      tasks: this.getTasks(),
      rmaAlerts: this.getRmaAlerts()
    };
  }

  // Mutators
  public updateInventoryStock(sku: string, newStock: number): InventoryItem | null {
    const item = this.inventory.find(i => i.sku.toUpperCase() === sku.toUpperCase());
    if (!item) return null;
    item.currentStock = newStock;
    if (item.currentStock <= item.safetyMin * 0.5) {
      item.status = 'critical';
    } else if (item.currentStock <= item.safetyMin) {
      item.status = 'low';
    } else {
      item.status = 'nominal';
    }
    return { ...item };
  }

  public createPurchaseOrder(sku: string, quantity: number): PurchaseOrder | null {
    const item = this.inventory.find(i => i.sku.toUpperCase() === sku.toUpperCase());
    if (!item) return null;

    // Check if draft already exists
    let existing = this.purchaseOrders.find(p => p.sku === item.sku && p.status === 'draft');
    if (existing) {
      existing.quantity = quantity;
      existing.totalCost = Number((existing.unitCost * quantity).toFixed(2));
      return { ...existing };
    }

    const randId = Math.floor(1000 + Math.random() * 9000);
    const poNumber = item.sku.replace('SKU-', '');
    const newPO: PurchaseOrder = {
      id: `PO-${poNumber}-${randId}`,
      sku: item.sku,
      itemName: item.name,
      quantity,
      unitCost: item.unitCost,
      totalCost: Number((item.unitCost * quantity).toFixed(2)),
      supplier: item.supplier,
      status: 'queued',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      estimatedDelivery: '2 business days'
    };

    this.purchaseOrders.unshift(newPO);
    return newPO;
  }

  public dispatchPurchaseOrder(poId: string): PurchaseOrder | null {
    const po = this.purchaseOrders.find(p => p.id.toUpperCase() === poId.toUpperCase());
    if (!po) return null;
    po.status = 'dispatched';
    po.estimatedDelivery = '~2 hours supplier confirmation';
    return { ...po };
  }

  public updateTaskStatus(taskId: string, status: OperationalTask['status']): OperationalTask | null {
    const task = this.tasks.find(t => t.id.toUpperCase() === taskId.toUpperCase());
    if (!task) return null;
    task.status = status;
    return { ...task };
  }

  public resetToGroundTruth(): void {
    // Re-initializes state if needed
  }
}

export const opDb = new OperationalDatabase();
