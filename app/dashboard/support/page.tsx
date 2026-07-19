import { createClient } from "@/lib/admin/supabase/server";
import { redirect } from "next/navigation";
import { Ticket as TicketIcon, Search, PlusCircle, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Ticket {
  id: string;
  subject: string;
  date: string;
  department: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'resolved';
}

export default async function SupportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const studentId = user.user_metadata?.student_id;
  
  if (!studentId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Profile Incomplete</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
          Please complete your admission form to access support tickets.
        </p>
      </div>
    );
  }

  const { getStudentSupportTickets } = await import("@/lib/actions/studentData");
  const { tickets, totalTickets, openTickets, resolvedTickets } = await getStudentSupportTickets(studentId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Support Tickets</h1>
          <p className="text-slate-500 dark:text-slate-400">Get help with billing, technical issues, or academics.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/25">
          <PlusCircle className="w-5 h-5" /> Create Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <TicketIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">{totalTickets}</p>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Tickets</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">{openTickets}</p>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Open</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">{resolvedTickets}</p>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Resolved</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-2xl w-full sm:w-max border border-slate-200/50 dark:border-slate-800/50">
            <button className="flex-1 sm:flex-none px-5 py-2 text-sm font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl shadow-sm">All</button>
            <button className="flex-1 sm:flex-none px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Open</button>
            <button className="flex-1 sm:flex-none px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Resolved</button>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tickets..." 
              className="w-full bg-slate-100 dark:bg-slate-800/50 border-transparent focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Ticket</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 font-medium">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    <TicketIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    No support tickets found.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket: Ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-900 dark:text-white mb-0.5">{ticket.subject}</p>
                      <p className="text-xs text-slate-500">{ticket.id} • {ticket.date}</p>
                    </td>
                    <td className="px-6 py-5">{ticket.department}</td>
                    <td className="px-6 py-5">
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                        ticket.priority === 'high' ? 'text-red-500' : 
                        ticket.priority === 'medium' ? 'text-amber-500' : 
                        'text-slate-500'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {ticket.status === 'open' ? (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">Open</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">Resolved</Badge>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="inline-flex items-center gap-2 p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition-colors">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
