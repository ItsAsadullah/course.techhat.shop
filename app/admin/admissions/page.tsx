"use client";

import { useEffect, useState } from "react";
import { getPendingAdmissions, approveAdmission } from "@/lib/admin/actions/admissions";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";

interface Admission {
  id: string;
  admission_id: string;
  students?: Record<string, unknown>[];
  courses?: Record<string, unknown>;
  batches?: Record<string, unknown>;
  [key: string]: unknown;
}

export default function PendingAdmissionsPage() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadAdmissions();
  }, []);

  const loadAdmissions = async () => {
    setLoading(true);
    const data = await getPendingAdmissions();
    setAdmissions(data);
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    setProcessing(id);
    const result = await approveAdmission(id);
    if (result.success) {
      toast.success("Admission approved successfully!");
      await loadAdmissions();
    } else {
      toast.error(result.error || "Failed to approve admission");
    }
    setProcessing(null);
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Admission ID</TableHead>
              <TableHead>Student Details</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Sender Number</TableHead>
              <TableHead>TrxID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-slate-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading pending admissions...
                </TableCell>
              </TableRow>
            ) : admissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-slate-500">
                  No pending admissions requiring verification.
                </TableCell>
              </TableRow>
            ) : (
              admissions.map((adm) => (
                <TableRow key={adm.id}>
                  <TableCell className="font-medium text-blue-600">{adm.admission_id as string}</TableCell>
                  <TableCell>
                    <div className="font-semibold">{(adm.students?.[0]?.full_name_en as string) || "N/A"}</div>
                    <div className="text-xs text-slate-500">{(adm.students?.[0]?.mobile as string) || "N/A"}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase">{(adm.payment_method as string) || "N/A"}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{(adm.payment_number as string) || "N/A"}</TableCell>
                  <TableCell>
                    <code className="bg-slate-100 px-2 py-1 rounded text-slate-800">{(adm.trx_id as string) || "N/A"}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">Pending Verification</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      onClick={() => handleApprove(adm.id)}
                      disabled={processing === adm.id}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {processing === adm.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-1.5" />
                      )}
                      Approve
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
