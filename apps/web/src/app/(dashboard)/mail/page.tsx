import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { accounts, mails } from "@/constants/mail-data";
import { Mail } from "@/features/mail/components/mail";

export default function MailPage() {
  return (
    <>
      <DashboardPageHeader
        title="Mail"
        description="Manage your mail inbox and compose new messages."
      />

      <div className="@container/main px-4 lg:px-6 space-y-6">
        <Mail
          accounts={accounts}
          mails={mails}
          navCollapsedSize={4}
          defaultLayout={[20, 32, 48]}
          defaultCollapsed={false}
        />
      </div>
    </>
  );
}
