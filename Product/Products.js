document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('productForm');
  const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];
  let products = JSON.parse(localStorage.getItem('products')) || [];

  // Generate Product ID
  const generateProductId = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'short' });
      const count = products.length + 1;
      return `PROD-${year}-${month}-${String(count).padStart(4, '0')}`;
  };

  // Populate Product ID
  document.getElementById('productId').value = generateProductId();

  // Save Product
  form.addEventListener('submit', (e) => {
      e.preventDefault();
      const product = {
          id: document.getElementById('productId').value,
          name: document.getElementById('productName').value,
          description: document.getElementById('productDescription').value,
          unit: document.getElementById('productUnit').value,
          price: document.getElementById('productPrice').value,
          photo: document.getElementById('productPhoto').files[0] ? URL.createObjectURL(document.getElementById('productPhoto').files[0]) : null,
      };
      products.push(product);
      localStorage.setItem('products', JSON.stringify(products));
      renderTable();
      form.reset();
      document.getElementById('productId').value = generateProductId();
  });

  // Render Table
  const renderTable = () => {
      productTable.innerHTML = '';
      products.forEach((product, index) => {
          const row = productTable.insertRow();
          row.innerHTML = `
              <td>${product.id}</td>
              <td>${product.name}</td>
              <td>${product.description}</td>
              <td>${product.unit}</td>
              <td>${product.price}</td>
              <td class="actions">
                  <button class="glow-button" onclick="editProduct(${index})">تعديل</button>
                  <button class="glow-button" onclick="deleteProduct(${index})">حذف</button>
                  <button class="glow-button" onclick="printProduct(${index})">طباعة</button>
              </td>
          `;
      });
  };

  // Edit Product
  window.editProduct = (index) => {
      const product = products[index];
      document.getElementById('productId').value = product.id;
      document.getElementById('productName').value = product.name;
      document.getElementById('productDescription').value = product.description;
      document.getElementById('productUnit').value = product.unit;
      document.getElementById('productPrice').value = product.price;
      products.splice(index, 1);
      localStorage.setItem('products', JSON.stringify(products));
      renderTable();
  };

  // Delete Product
  window.deleteProduct = (index) => {
      products.splice(index, 1);
      localStorage.setItem('products', JSON.stringify(products));
      renderTable();
  };

  // Print Product
  window.printProduct = (index) => {
      const product = products[index];
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow.document.write(`
          <h1>تفاصيل المنتج</h1>
          <p><strong>معرف المنتج:</strong> ${product.id}</p>
          <p><strong>اسم المنتج:</strong> ${product.name}</p>
          <p><strong>وصف المنتج:</strong> ${product.description}</p>
          <p><strong>وحدة المنتج:</strong> ${product.unit}</p>
          <p><strong>سعر المنتج:</strong> ${product.price}</p>
          ${product.photo ? `<img src="${product.photo}" alt="صورة المنتج" style="max-width: 100%;">` : ''}
      `);
      printWindow.document.close();
      printWindow.print();
  };

  // Initial Setup
  renderTable();
});