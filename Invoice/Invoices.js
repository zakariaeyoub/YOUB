document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('invoiceForm');
  const invoiceTable = document.getElementById('invoiceTable').getElementsByTagName('tbody')[0];
  let invoices = JSON.parse(localStorage.getItem('invoices')) || [];
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const quotations = JSON.parse(localStorage.getItem('quotations')) || [];
  const contracts = JSON.parse(localStorage.getItem('contracts')) || [];
  const products = JSON.parse(localStorage.getItem('products')) || [];

  // Generate Invoice ID
  const generateInvoiceId = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'short' });
      const count = invoices.length + 1;
      return `INV-${year}-${month}-${String(count).padStart(4, '0')}`;
  };

  // Populate Dropdowns
  const populateDropdowns = () => {
      const clientDropdown = document.getElementById('clientName');
      const quotationDropdown = document.getElementById('quotationId');
      const contractDropdown = document.getElementById('contractId');

      clientDropdown.innerHTML = clients.map(client => `<option value="${client.id}">${client.name}</option>`).join('');
      quotationDropdown.innerHTML = quotations.map(quotation => `<option value="${quotation.id}">${quotation.id}</option>`).join('');
      contractDropdown.innerHTML = contracts.map(contract => `<option value="${contract.id}">${contract.id}</option>`).join('');
  };

  // Add Product Row
  window.addProductRow = () => {
      const productSelection = document.getElementById('productSelection').getElementsByTagName('tbody')[0];
      const row = productSelection.insertRow();
      row.innerHTML = `
          <td>
              <select class="productSelect">
                  ${products.map(product => `<option value="${product.id}">${product.name}</option>`).join('')}
              </select>
          </td>
          <td><input type="number" class="quantity" min="1" value="1"></td>
          <td><input type="number" class="unitPrice" readonly></td>
          <td><input type="number" class="totalPrice" readonly></td>
          <td><button type="button" class="glow-button" onclick="removeProductRow(this)">إزالة</button></td>
      `;
      updateProductPrices(row);
  };

  // Remove Product Row
  window.removeProductRow = (button) => {
      const row = button.closest('tr');
      row.remove();
  };

  // Update Product Prices
  const updateProductPrices = (row) => {
      const productSelect = row.querySelector('.productSelect');
      const quantityInput = row.querySelector('.quantity');
      const unitPriceInput = row.querySelector('.unitPrice');
      const totalPriceInput = row.querySelector('.totalPrice');

      const product = products.find(p => p.id === productSelect.value);
      if (product) {
          unitPriceInput.value = product.price;
          totalPriceInput.value = (product.price * quantityInput.value).toFixed(2);
      }

      productSelect.addEventListener('change', () => {
          const product = products.find(p => p.id === productSelect.value);
          if (product) {
              unitPriceInput.value = product.price;
              totalPriceInput.value = (product.price * quantityInput.value).toFixed(2);
          }
      });

      quantityInput.addEventListener('input', () => {
          totalPriceInput.value = (unitPriceInput.value * quantityInput.value).toFixed(2);
      });
  };

  // Save Invoice
  form.addEventListener('submit', (e) => {
      e.preventDefault();
      const productSelection = document.getElementById('productSelection').getElementsByTagName('tbody')[0];
      const selectedProducts = Array.from(productSelection.rows).map(row => ({
          productId: row.querySelector('.productSelect').value,
          quantity: row.querySelector('.quantity').value,
          unitPrice: row.querySelector('.unitPrice').value,
          totalPrice: row.querySelector('.totalPrice').value,
      }));
      const totalAmount = selectedProducts.reduce((sum, product) => sum + parseFloat(product.totalPrice), 0);
      const invoice = {
          id: document.getElementById('invoiceId').value,
          clientId: document.getElementById('clientName').value,
          quotationId: document.getElementById('quotationId').value,
          contractId: document.getElementById('contractId').value,
          date: document.getElementById('date').value,
          products: selectedProducts,
          terms: document.getElementById('terms').value,
          totalAmount: totalAmount.toFixed(2),
      };
      invoices.push(invoice);
      localStorage.setItem('invoices', JSON.stringify(invoices));
      renderTable();
      form.reset();
      document.getElementById('invoiceId').value = generateInvoiceId();
      productSelection.innerHTML = ''; // Clear product selection table
  });

  // Render Table
  const renderTable = () => {
      invoiceTable.innerHTML = '';
      invoices.forEach((invoice, index) => {
          const client = clients.find(c => c.id === invoice.clientId);
          const row = invoiceTable.insertRow();
          row.innerHTML = `
              <td>${invoice.id}</td>
              <td>${client ? client.name : 'N/A'}</td>
              <td>${invoice.date}</td>
              <td>${invoice.totalAmount}</td>
              <td class="actions">
                  <button class="glow-button" onclick="editInvoice(${index})">تعديل</button>
                  <button class="glow-button" onclick="deleteInvoice(${index})">حذف</button>
                  <button class="glow-button" onclick="printInvoice(${index})">طباعة</button>
              </td>
          `;
      });
  };

  // Edit Invoice
  window.editInvoice = (index) => {
      const invoice = invoices[index];
      document.getElementById('invoiceId').value = invoice.id;
      document.getElementById('clientName').value = invoice.clientId;
      document.getElementById('quotationId').value = invoice.quotationId;
      document.getElementById('contractId').value = invoice.contractId;
      document.getElementById('date').value = invoice.date;
      document.getElementById('terms').value = invoice.terms;
      invoices.splice(index, 1);
      localStorage.setItem('invoices', JSON.stringify(invoices));
      renderTable();
  };

  // Delete Invoice
  window.deleteInvoice = (index) => {
      invoices.splice(index, 1);
      localStorage.setItem('invoices', JSON.stringify(invoices));
      renderTable();
  };

  // Print Invoice
  window.printInvoice = (index) => {
      const invoice = invoices[index];
      const client = clients.find(c => c.id === invoice.clientId);
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow.document.write(`
          <h1>تفاصيل الفاتورة</h1>
          <p><strong>معرف الفاتورة:</strong> ${invoice.id}</p>
          <p><strong>اسم العميل:</strong> ${client ? client.name : 'N/A'}</p>
          <p><strong>التاريخ:</strong> ${invoice.date}</p>
          <p><strong>الشروط:</strong> ${invoice.terms}</p>
      `);
      printWindow.document.close();
      printWindow.print();
  }; 
   
   // Initial Setup
    document.getElementById('invoiceId').value = generateInvoiceId();
    populateDropdowns();
    renderTable();
});