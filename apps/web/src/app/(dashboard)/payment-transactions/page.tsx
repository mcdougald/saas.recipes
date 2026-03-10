import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { TransactionsStats } from "@/features/payment-transactions/components/transactions-stats";
import { TransactionsTable } from "@/features/payment-transactions/components/transactions-table";
import { transactions } from "@/features/payment-transactions/utils/transaction-data";

export default function PaymentTransactionsPage() {
  return (
    <>
      <DashboardPageHeader
        title="Payment Transactions"
        description="View and manage all payment transactions across your platform."
      />

      <div className="@container/main px-4 lg:px-6 space-y-6">
        <TransactionsStats />
        <TransactionsTable data={transactions} />
      </div>
    </>
  );
}
