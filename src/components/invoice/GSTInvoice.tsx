import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InvoiceItem {
  description: string;
  hsnCode: string;
  weight: number;
  rate: number;
  makingCharges: number;
  basePrice: number;
  cgst: number;
  sgst: number;
  total: number;
}

interface CustomerDetails {
  name: string;
  address: string;
  phone: string;
  gstin: string;
}

interface GSTInvoiceProps {
  open: boolean;
  onClose: () => void;
  items: InvoiceItem[];
  customer: CustomerDetails;
  onCustomerChange: (customer: CustomerDetails) => void;
  invoiceNumber: string;
  invoiceDate: string;
  shopDetails: {
    name: string;
    address: string;
    gstin: string;
    phone: string;
  };
  cgstRate: number;
  sgstRate: number;
}

export function GSTInvoice({
  open,
  onClose,
  items,
  customer,
  onCustomerChange,
  invoiceNumber,
  invoiceDate,
  shopDetails,
  cgstRate,
  sgstRate,
}: GSTInvoiceProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const totals = items.reduce(
    (acc, item) => ({
      basePrice: acc.basePrice + item.basePrice,
      cgst: acc.cgst + item.cgst,
      sgst: acc.sgst + item.sgst,
      total: acc.total + item.total,
    }),
    { basePrice: 0, cgst: 0, sgst: 0, total: 0 }
  );

  const formatPrice = (price: number) =>
    price.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GST Invoice - ${invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 20px; color: #1a1a1a; }
            .invoice-container { max-width: 800px; margin: 0 auto; border: 2px solid #d4af37; padding: 30px; }
            .header { text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { color: #d4af37; font-size: 28px; margin-bottom: 5px; }
            .header p { color: #666; font-size: 12px; }
            .tax-invoice { background: #d4af37; color: white; padding: 8px 20px; display: inline-block; font-weight: bold; margin: 10px 0; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .detail-box { padding: 15px; background: #faf8f5; border-radius: 8px; }
            .detail-box h3 { color: #d4af37; font-size: 14px; margin-bottom: 10px; text-transform: uppercase; }
            .detail-box p { font-size: 13px; margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #d4af37; color: white; padding: 12px 8px; text-align: left; font-size: 12px; }
            td { padding: 10px 8px; border-bottom: 1px solid #eee; font-size: 12px; }
            .text-right { text-align: right; }
            .totals { margin-top: 20px; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .totals-row.final { border-top: 2px solid #d4af37; border-bottom: none; font-weight: bold; font-size: 16px; color: #d4af37; padding-top: 12px; }
            .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #666; }
            .signature { margin-top: 60px; text-align: right; }
            .signature-line { border-top: 1px solid #333; width: 200px; margin-left: auto; padding-top: 5px; }
            @media print { body { padding: 0; } .invoice-container { border: 1px solid #d4af37; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>GST Invoice</span>
            <div className="flex gap-2">
              <Button variant="gold" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print Invoice
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Customer Details Form */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-lg mb-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input
              id="customerName"
              value={customer.name}
              onChange={(e) =>
                onCustomerChange({ ...customer, name: e.target.value })
              }
              placeholder="Enter customer name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone Number</Label>
            <Input
              id="customerPhone"
              value={customer.phone}
              onChange={(e) =>
                onCustomerChange({ ...customer, phone: e.target.value })
              }
              placeholder="Enter phone number"
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="customerAddress">Address</Label>
            <Input
              id="customerAddress"
              value={customer.address}
              onChange={(e) =>
                onCustomerChange({ ...customer, address: e.target.value })
              }
              placeholder="Enter customer address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerGstin">GSTIN (Optional)</Label>
            <Input
              id="customerGstin"
              value={customer.gstin || ""}
              onChange={(e) =>
                onCustomerChange({ ...customer, gstin: e.target.value })
              }
              placeholder="Enter GSTIN if applicable"
            />
          </div>
        </div>

        {/* Invoice Preview */}
        <div
          ref={printRef}
          className="bg-white text-gray-900 p-6 rounded-lg border"
        >
          <div className="invoice-container">
            {/* Header */}
            <div className="header text-center border-b-2 border-gold pb-4 mb-4">
              <h1 className="text-2xl font-serif font-bold text-gold">
                {shopDetails.name}
              </h1>
              <p className="text-sm text-gray-600">{shopDetails.address}</p>
              <p className="text-sm text-gray-600">
                Phone: {shopDetails.phone} | GSTIN: {shopDetails.gstin}
              </p>
              <div className="inline-block bg-gold text-white px-4 py-2 mt-3 font-semibold">
                TAX INVOICE
              </div>
            </div>

            {/* Invoice & Customer Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-amber-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gold mb-2">
                  INVOICE DETAILS
                </h3>
                <p className="text-sm">
                  <strong>Invoice No:</strong> {invoiceNumber}
                </p>
                <p className="text-sm">
                  <strong>Date:</strong> {invoiceDate}
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gold mb-2">
                  BILL TO
                </h3>
                <p className="text-sm font-medium">{customer.name || "—"}</p>
                <p className="text-sm">{customer.address || "—"}</p>
                <p className="text-sm">Phone: {customer.phone || "—"}</p>
                {customer.gstin && (
                  <p className="text-sm">GSTIN: {customer.gstin}</p>
                )}
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full border-collapse mb-4">
              <thead>
                <tr className="bg-gold text-white">
                  <th className="p-2 text-left text-xs">Description</th>
                  <th className="p-2 text-left text-xs">HSN</th>
                  <th className="p-2 text-right text-xs">Weight (g)</th>
                  <th className="p-2 text-right text-xs">Rate/g</th>
                  <th className="p-2 text-right text-xs">Making</th>
                  <th className="p-2 text-right text-xs">Base</th>
                  <th className="p-2 text-right text-xs">CGST</th>
                  <th className="p-2 text-right text-xs">SGST</th>
                  <th className="p-2 text-right text-xs">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="p-2 text-sm">{item.description}</td>
                    <td className="p-2 text-sm">{item.hsnCode}</td>
                    <td className="p-2 text-sm text-right">{item.weight}</td>
                    <td className="p-2 text-sm text-right">
                      ₹{formatPrice(item.rate)}
                    </td>
                    <td className="p-2 text-sm text-right">
                      ₹{formatPrice(item.makingCharges)}
                    </td>
                    <td className="p-2 text-sm text-right">
                      ₹{formatPrice(item.basePrice)}
                    </td>
                    <td className="p-2 text-sm text-right">
                      ₹{formatPrice(item.cgst)}
                    </td>
                    <td className="p-2 text-sm text-right">
                      ₹{formatPrice(item.sgst)}
                    </td>
                    <td className="p-2 text-sm text-right font-semibold">
                      ₹{formatPrice(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-72">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-sm">Taxable Amount</span>
                  <span className="text-sm">₹{formatPrice(totals.basePrice)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-sm">CGST @ {cgstRate}%</span>
                  <span className="text-sm">₹{formatPrice(totals.cgst)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-sm">SGST @ {sgstRate}%</span>
                  <span className="text-sm">₹{formatPrice(totals.sgst)}</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-gold mt-2">
                  <span className="font-bold text-gold">Grand Total</span>
                  <span className="font-bold text-gold text-lg">
                    ₹{formatPrice(totals.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-between items-end">
              <div className="text-xs text-gray-500">
                <p>Terms & Conditions:</p>
                <p>1. Goods once sold will not be taken back.</p>
                <p>2. Subject to local jurisdiction only.</p>
              </div>
              <div className="text-center">
                <div className="border-t border-gray-400 w-40 pt-2 mt-10">
                  <p className="text-sm">Authorized Signatory</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
