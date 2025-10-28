import jsPDF from 'jspdf';
import 'jspdf-autotable';

export async function generateInvoice(order) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 14, 22);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('SLNS - B2B Ethnic Wear', 14, 30);
  doc.text('123 T. Nagar, Chennai, Tamil Nadu 600017', 14, 35);
  doc.text('business@slns.in', 14, 40);

  // Bill To & Order Info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 14, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(order.profiles.company_name, 14, 61);
  doc.text(order.shipping_address.address_line_1, 14, 66);
  doc.text(`${order.shipping_address.city}, ${order.shipping_address.state} - ${order.shipping_address.pincode}`, 14, 71);

  doc.setFontSize(10);
  doc.text(`Invoice #: INV-${order.id.toString().padStart(6, '0')}`, 140, 55);
  doc.text(`Order ID: #${order.id.toString().slice(-6)}`, 140, 60);
  doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 140, 65);
  
  // Table
  const tableColumn = ["#", "Product", "Qty", "Unit Price", "Total"];
  const tableRows = [];

  order.order_items.forEach((item, index) => {
    const rowData = [
      index + 1,
      item.products.name,
      item.quantity,
      `Rs. ${item.price.toFixed(2)}`,
      `Rs. ${(item.price * item.quantity).toFixed(2)}`
    ];
    tableRows.push(rowData);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 85,
    theme: 'striped',
    headStyles: { fillColor: [38, 38, 38] } // neutral-800
  });

  // Totals
  const finalY = doc.lastAutoTable.finalY;
  const subtotal = order.order_items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = subtotal * 0.18;

  doc.setFontSize(10);
  doc.text('Subtotal:', 140, finalY + 10);
  doc.text(`Rs. ${subtotal.toFixed(2)}`, 190, finalY + 10, { align: 'right' });
  doc.text('GST (18%):', 140, finalY + 15);
  doc.text(`Rs. ${gst.toFixed(2)}`, 190, finalY + 15, { align: 'right' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Grand Total:', 140, finalY + 25);
  doc.text(`Rs. ${order.total_amount.toFixed(2)}`, 190, finalY + 25, { align: 'right' });

  // Footer
  doc.setFontSize(10);
  doc.text('Thank you for your business!', 14, doc.internal.pageSize.height - 15);
  doc.text('Payment is due within 30 days.', 14, doc.internal.pageSize.height - 10);

  // Save
  doc.save(`invoice-SLNS-${order.id}.pdf`);
}
