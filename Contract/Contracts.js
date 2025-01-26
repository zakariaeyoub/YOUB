document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contractForm');
  const contractTable = document.getElementById('contractTable').getElementsByTagName('tbody')[0];
  let contracts = JSON.parse(localStorage.getItem('contracts')) || [];
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const quotations = JSON.parse(localStorage.getItem('quotations')) || [];

  // Generate Contract ID
  const generateContractId = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'short' });
      const count = contracts.length + 1;
      return `CNT-${year}-${month}-${String(count).padStart(4, '0')}`;
  };

  // Populate Dropdowns
  const populateDropdowns = () => {
      const clientDropdown = document.getElementById('clientName');
      const quotationDropdown = document.getElementById('quotationId');

      clientDropdown.innerHTML = clients.map(client => `<option value="${client.id}">${client.name}</option>`).join('');
      quotationDropdown.innerHTML = quotations.map(quotation => `<option value="${quotation.id}">${quotation.id}</option>`).join('');
  };

  // Save Contract
  form.addEventListener('submit', (e) => {
      e.preventDefault();
      const contract = {
          id: document.getElementById('contractId').value,
          clientId: document.getElementById('clientName').value,
          quotationId: document.getElementById('quotationId').value,
          projectLocation: document.getElementById('projectLocation').value,
          scopeOfWork: document.getElementById('scopeOfWork').value,
      };
      contracts.push(contract);
      localStorage.setItem('contracts', JSON.stringify(contracts));
      renderTable();
      form.reset();
      document.getElementById('contractId').value = generateContractId();
  });

  // Render Table
  const renderTable = () => {
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

  // Edit Contract
  window.editContract = (index) => {
      const contract = contracts[index];
      document.getElementById('contractId').value = contract.id;
      document.getElementById('clientName').value = contract.clientId;
      document.getElementById('quotationId').value = contract.quotationId;
      document.getElementById('projectLocation').value = contract.projectLocation;
      document.getElementById('scopeOfWork').value = contract.scopeOfWork;
      contracts.splice(index, 1);
      localStorage.setItem('contracts', JSON.stringify(contracts));
      renderTable();
  };

  // Delete Contract
  window.deleteContract = (index) => {
      contracts.splice(index, 1);
      localStorage.setItem('contracts', JSON.stringify(contracts));
      renderTable();
  };

  // Print Contract
  window.printContract = (index) => {
      const contract = contracts[index];
      const client = clients.find(c => c.id === contract.clientId);
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow.document.write(`
          <h1>تفاصيل العقد</h1>
          <p><strong>معرف العقد:</strong> ${contract.id}</p>
          <p><strong>اسم العميل:</strong> ${client ? client.name : 'N/A'}</p>
          <p><strong>موقع المشروع:</strong> ${contract.projectLocation}</p>
          <p><strong>نطاق العمل:</strong> ${contract.scopeOfWork}</p>
      `);
      printWindow.document.close();
      printWindow.print();
  };

  // Initial Setup
  document.getElementById('contractId').value = generateContractId();
  populateDropdowns();
  renderTable();
});