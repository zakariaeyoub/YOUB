document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('clientForm');
  const clientTable = document.getElementById('clientTable').getElementsByTagName('tbody')[0];
  let clients = JSON.parse(localStorage.getItem('clients')) || [];

  // Generate Client ID
  const generateClientId = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'short' });
      const count = clients.length + 1;
      return `CLT-${year}-${month}-${String(count).padStart(4, '0')}`;
  };

  // Populate Client ID
  document.getElementById('clientId').value = generateClientId();

  // Save Client
  form.addEventListener('submit', (e) => {
      e.preventDefault();
      const client = {
          id: document.getElementById('clientId').value,
          date: document.getElementById('date').value,
          name: document.getElementById('clientName').value,
          siteLocation: document.getElementById('siteLocation').value,
          phoneNumber: document.getElementById('phoneNumber').value,
          address: document.getElementById('address').value,
          email: document.getElementById('email').value,
          moreInfo: document.getElementById('moreInfo').value,
      };
      clients.push(client);
      localStorage.setItem('clients', JSON.stringify(clients));
      renderTable();
      form.reset();
      document.getElementById('clientId').value = generateClientId();
  });

  // Render Table
  const renderTable = () => {
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

  // Edit Client
  window.editClient = (index) => {
      const client = clients[index];
      document.getElementById('clientId').value = client.id;
      document.getElementById('date').value = client.date;
      document.getElementById('clientName').value = client.name;
      document.getElementById('siteLocation').value = client.siteLocation;
      document.getElementById('phoneNumber').value = client.phoneNumber;
      document.getElementById('address').value = client.address;
      document.getElementById('email').value = client.email;
      document.getElementById('moreInfo').value = client.moreInfo;
      clients.splice(index, 1);
      localStorage.setItem('clients', JSON.stringify(clients));
      renderTable();
  };

  // Delete Client
  window.deleteClient = (index) => {
      clients.splice(index, 1);
      localStorage.setItem('clients', JSON.stringify(clients));
      renderTable();
  };

  // Print Client
  window.printClient = (index) => {
      const client = clients[index];
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow.document.write(`
          <h1>تفاصيل العميل</h1>
          <p><strong>معرف العميل:</strong> ${client.id}</p>
          <p><strong>اسم العميل:</strong> ${client.name}</p>
          <p><strong>رقم الهاتف:</strong> ${client.phoneNumber}</p>
          <p><strong>العنوان:</strong> ${client.address}</p>
          <p><strong>البريد الإلكتروني:</strong> ${client.email}</p>
          <p><strong>معلومات إضافية:</strong> ${client.moreInfo}</p>
      `);
      printWindow.document.close();
      printWindow.print();
  };

  renderTable();
});