document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quotationForm');
  const quotationTable = document.getElementById('quotationTable').getElementsByTagName('tbody')[0];
  let quotations = JSON.parse(localStorage.getItem('quotations')) || [];
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const products = JSON.parse(localStorage.getItem('products')) || [];

  // Generate Quotation ID
  const generateQuotationId = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'short' });
      const count = quotations.length + 1;
      return `QOUTE-${year}-${month}-${String(count).padStart(4, '0')}`;
  };

  // Populate Client Dropdown
  const populateClientDropdown = () => {
      const clientDropdown = document.getElementById('clientName');
      clientDropdown.innerHTML = clients.map(client => `<option value="${client.id}">${client.name}</option>`).join('');
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

  // Save Quotation
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
      const quotation = {
          id: document.getElementById('quotationId').value,
          clientId: document.getElementById('clientName').value,
          date: document.getElementById('date').value,
          products: selectedProducts,
          terms: document.getElementById('terms').value,
          totalAmount: totalAmount.toFixed(2),
      };
      quotations.push(quotation);
      localStorage.setItem('quotations', JSON.stringify(quotations));
      renderTable();
      form.reset();
      document.getElementById('quotationId').value = generateQuotationId();
      productSelection.innerHTML = ''; // Clear product selection table
  });

  // Render Table
  const renderTable = () => {
      quotationTable.innerHTML = '';
      quotations.forEach((quotation, index) => {
          const client = clients.find(c => c.id === quotation.clientId);
          const row = quotationTable.insertRow();
          row.innerHTML = `
              <td>${quotation.id}</td>
              <td>${client ? client.name : 'N/A'}</td>
              <td>${quotation.date}</td>
              <td>${quotation.totalAmount}</td>
              <td class="actions">
                  <button class="glow-button" onclick="editQuotation(${index})">تعديل</button>
                  <button class="glow-button" onclick="deleteQuotation(${index})">حذف</button>
                  <button class="glow-button" onclick="printQuotation(${index})">طباعة</button>
              </td>
          `;
      });
  };

  // Edit Quotation
  window.editQuotation = (index) => {
      const quotation = quotations[index];
      document.getElementById('quotationId').value = quotation.id;
      document.getElementById('clientName').value = quotation.clientId;
      document.getElementById('date').value = quotation.date;
      document.getElementById('terms').value = quotation.terms;
      quotations.splice(index, 1);
      localStorage.setItem('quotations', JSON.stringify(quotations));
      renderTable();
  };

  // Delete Quotation
  window.deleteQuotation = (index) => {
      quotations.splice(index, 1);
      localStorage.setItem('quotations', JSON.stringify(quotations));
      renderTable();
  };

  // Print Quotation
  window.printQuotation = (index) => {
      const quotation = quotations[index];
      const client = clients.find(c => c.id === quotation.clientId);
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow.document.write(`
          <h1>تفاصيل العرض</h1>
          <p><strong>معرف العرض:</strong> ${quotation.id}</p>
          <p><strong>اسم العميل:</strong> ${client ? client.name : 'N/A'}</p>
          <p><strong>التاريخ:</strong> ${quotation.date}</p>
          <p><strong>الشروط:</strong> ${quotation.terms}</p>
      `);
      printWindow.document.close();
      printWindow.print();
  };

  // Initial Setup
  document.getElementById('quotationId').value = generateQuotationId();
  populateClientDropdown();
  renderTable();
});