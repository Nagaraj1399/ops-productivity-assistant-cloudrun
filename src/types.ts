export interface InventoryItem {
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  safetyMin: number;
  reorderQuantity: number;
  unitCost: number;
  retailPrice: number;
  dailyVelocity: number; // units sold per day
  leadTimeDays: number;
  supplier: string;
  status: 'critical' | 'low' | 'nominal';
}

export interface PurchaseOrder {
  id: string;
  sku: string;
  itemName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplier: string;
  status: 'draft' | 'queued' | 'dispatched' | 'received';
  createdAt: string;
  estimatedDelivery?: string;
}

export interface SalesSummary {
  date: string;
  grossSales: number;
  orderCount: number;
  aov: number;
  conversionRate: number;
  topPerformer: {
    sku: string;
    name: string;
    unitsSold: number;
    revenue: number;
  };
  laggingSector: {
    category: string;
    changePctVs7Day: number;
    note: string;
  };
  categoryBreakdown: {
    category: string;
    revenue: number;
    unitsSold: number;
    growthPct: number;
  }[];
  hourlySales: {
    hour: string;
    sales: number;
    orders: number;
  }[];
}

export interface OperationalTask {
  id: string;
  title: string;
  department: 'logistics' | 'vendor' | 'fulfillment' | 'executive';
  priority: 'high' | 'critical' | 'medium';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
  actionRequired: string;
  dueDate: string;
}

export interface RmaAlert {
  id: string;
  sku: string;
  itemName: string;
  returnRate: number;
  benchmarkRate: number;
  primaryReason: string;
  status: 'active' | 'investigating' | 'resolved';
}

export interface ToolCallExecution {
  id: string;
  toolName: string;
  args: Record<string, any>;
  result: any;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolCalls?: ToolCallExecution[];
  actionPrompt?: {
    label: string;
    actionType: string;
    payload: Record<string, any>;
  };
}

export interface OperationsState {
  inventory: InventoryItem[];
  purchaseOrders: PurchaseOrder[];
  salesSummary: SalesSummary;
  tasks: OperationalTask[];
  rmaAlerts: RmaAlert[];
}
