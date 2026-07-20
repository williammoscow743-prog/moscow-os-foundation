import type { Database } from "@/integrations/supabase/types";

export type ExpenseRow = Database["public"]["Tables"]["expenses"]["Row"];
export type ExpenseInsert = Database["public"]["Tables"]["expenses"]["Insert"];
export type ExpenseUpdate = Database["public"]["Tables"]["expenses"]["Update"];

export type BillRow = Database["public"]["Tables"]["bills"]["Row"];
export type BillInsert = Database["public"]["Tables"]["bills"]["Insert"];
export type BillUpdate = Database["public"]["Tables"]["bills"]["Update"];

export type IncomeRow = Database["public"]["Tables"]["income"]["Row"];
export type IncomeInsert = Database["public"]["Tables"]["income"]["Insert"];
export type IncomeUpdate = Database["public"]["Tables"]["income"]["Update"];

export type BudgetRow = Database["public"]["Tables"]["budgets"]["Row"];
export type BudgetInsert = Database["public"]["Tables"]["budgets"]["Insert"];
export type BudgetUpdate = Database["public"]["Tables"]["budgets"]["Update"];

export type ExpenseCategoryRow = Database["public"]["Tables"]["expense_categories"]["Row"];
export type ExpenseCategoryInsert = Database["public"]["Tables"]["expense_categories"]["Insert"];

export type CashFlowRow = Database["public"]["Tables"]["cash_flow_snapshots"]["Row"];
export type FinanceReportRow = Database["public"]["Tables"]["finance_reports"]["Row"];

export type BillFrequency = "once" | "weekly" | "monthly" | "quarterly" | "yearly";
export type BillStatus = "upcoming" | "due_today" | "overdue" | "paid" | "cancelled";

export const EXPENSE_CATEGORIES = [
  "rent",
  "electricity",
  "water",
  "internet",
  "fuel",
  "transport",
  "groceries",
  "marketing",
  "office_supplies",
  "equipment",
  "salaries",
  "software",
  "insurance",
  "medical",
  "entertainment",
  "other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  rent: "Rent",
  electricity: "Electricity",
  water: "Water",
  internet: "Internet",
  fuel: "Fuel",
  transport: "Transport",
  groceries: "Groceries",
  marketing: "Marketing",
  office_supplies: "Office supplies",
  equipment: "Equipment",
  salaries: "Salaries",
  software: "Software",
  insurance: "Insurance",
  medical: "Medical",
  entertainment: "Entertainment",
  other: "Other",
};

export const INCOME_CATEGORIES = [
  "salary",
  "sales",
  "consulting",
  "freelance",
  "investment",
  "refund",
  "other",
] as const;

export const INCOME_CATEGORY_LABELS: Record<string, string> = {
  salary: "Salary",
  sales: "Sales",
  consulting: "Consulting",
  freelance: "Freelance",
  investment: "Investment",
  refund: "Refund",
  other: "Other",
};

export const BILL_FREQUENCIES: { value: BillFrequency; label: string }[] = [
  { value: "once", label: "Once" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

export const BILL_STATUS_LABELS: Record<BillStatus, string> = {
  upcoming: "Upcoming",
  due_today: "Due today",
  overdue: "Overdue",
  paid: "Paid",
  cancelled: "Cancelled",
};

export const BILL_STATUS_STYLES: Record<BillStatus, string> = {
  upcoming: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  due_today: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  overdue: "bg-red-500/10 text-red-600 dark:text-red-400",
  paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  cancelled: "bg-muted text-muted-foreground",
};

export const PAYMENT_METHODS = [
  "cash",
  "credit_card",
  "debit_card",
  "bank_transfer",
  "check",
  "paypal",
  "stripe",
  "other",
] as const;

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  credit_card: "Credit card",
  debit_card: "Debit card",
  bank_transfer: "Bank transfer",
  check: "Check",
  paypal: "PayPal",
  stripe: "Stripe",
  other: "Other",
};
