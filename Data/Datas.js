document.addEventListener('DOMContentLoaded', () => {
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const quotations = JSON.parse(localStorage.getItem('quotations')) || [];
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
  const contracts = JSON.parse(localStorage.getItem('contracts')) || [];

  // Show Tab
  window.showTab = (tabName) => {
      const tabs = document.querySelectorAll('.tabContent');
      tabs.forEach(tab => tab.style.display = 'none');
      document.getElementById(`${tabName}Tab`).style.display = 'block';
  };

  // Render Clients Table
  const renderClientTable = () => {
      const clientTable = document.getElementById('clientTable').getElementsByTagName('tbody')[0];
      clientTable.innerHTML = '';
      clients.forEach((client, index) => {
          const row = clientTable.insertRow();
          row.innerHTML = `
              <td>${client.id}</td>
              <td>${client.name}</td>
              <td>${client.phoneNumber}</td>
              <td class="actions">
                  <button class="glow-button" onclick="editClient(${index})">تعديل</button>
                  <button class="glow-button" onclick="deleteClient(${index})">حذف</button>
                  <button class="glow-button" onclick="printClient(${index})">طباعة</button>
              </td>
          `;
      });
  };

  // Render Quotations Table
  const renderQuotationTable = () => {
      const quotationTable = document.getElementById('quotationTable').getElementsByTagName('tbody')[0];
      quotationTable.innerHTML = '';
      quotations.forEach((quotation, index) => {
          const client = clients.find(c => c.id === quotation.clientId);
          const row = quotationTable.insertRow();
          row.innerHTML = `
              <td>${quotation.id}</td>
              <td>${client ? client.name : 'N/A'}</td>
              <td>${quotation.date}</td>
              <td class="actions">
                  <button class="glow-button" onclick="editQuotation(${index})">تعديل</button>
                  <button class="glow-button" onclick="deleteQuotation(${index})">حذف</button>
                  <button class="glow-button" onclick="printQuotation(${index})">طباعة</button>
              </td>
          `;
      });
  };

  // Render Products Table
  const renderProductTable = () => {
      const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];
      productTable.innerHTML = '';
      products.forEach((product, index) => {
          const row = productTable.insertRow();
          row.innerHTML = `
              <td>${product.id}</td>
              <td>${product.name}</td>
              <td>${product.price}</td>
              <td class="actions">
                  <button class="glow-button" onclick="editProduct(${index})">تعديل</button>
                  <button class="glow-button" onclick="deleteProduct(${index})">حذف</button>
                  <button class="glow-button" onclick="printProduct(${index})">طباعة</button>
              </td>
          `;
      });
  };

  // Render Invoices Table
  const renderInvoiceTable = () => {
      const invoiceTable = document.getElementById('invoiceTable').getElementsByTagName('tbody')[0];
      invoiceTable.innerHTML = '';
      invoices.forEach((invoice, index) => {
          const client = clients.find(c => c.id === invoice.clientId);
          const row = invoiceTable.insertRow();
          row.innerHTML = `
              <td>${invoice.id}</td>
              <td>${client ? client.name : 'N/A'}</td>
              <td>${invoice.date}</td>
              <td class="actions">
                  <button class="glow-button" onclick="editInvoice(${index})">تعديل</button>
                  <button class="glow-button" onclick="deleteInvoice(${index})">حذف</button>
                  <button class="glow-button" onclick="printInvoice(${index})">طباعة</button>
              </td>
          `;
      });
  };

  // Render Contracts Table
  const renderContractTable = () => {
      const contractTable = document.getElementById('contractTable').getElementsByTagName('tbody')[0];
      contractTable.innerHTML = '';
      contracts.forEach((contract, index) => {
          const client = clients.find(c => c.id === contract.clientId);
          const row = contractTable.insertRow();
          row.innerHTML = `
              <td>${contract.id}</td>
              <td>${client ? client.name : 'N/A'}</td>
              <td>${contract.projectLocation}</td>
              <td class="actions">
                  <button class="glow-button" onclick="editContract(${index})">تعديل</button>
                  <button class="glow-button" onclick="deleteContract(${index})">حذف</button>
                  <button class="glow-button" onclick="printContract(${index})">طباعة</button>
              </td>
          `;
      });
  };

  // Initial Render
  renderClientTable();
  renderQuotationTable();
  renderProductTable();
  renderInvoiceTable();
  renderContractTable();
});