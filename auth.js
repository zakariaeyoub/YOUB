document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const otpForm = document.getElementById('otpForm');
  const switchText = document.getElementById('switchText');
  const switchLink = document.getElementById('switchLink');
  const formTitle = document.getElementById('form-title');
  let isLogin = true; // Toggle between login and register
  let otp = ''; // Store the generated OTP

  // Switch between login and register
  switchLink.addEventListener('click', (e) => {
      e.preventDefault();
      isLogin = !isLogin;
      formTitle.textContent = isLogin ? 'تسجيل الدخول' : 'التسجيل';
      switchText.innerHTML = isLogin
          ? 'ليس لديك حساب؟ <a href="#" id="switchLink">سجل هنا</a>'
          : 'لديك حساب بالفعل؟ <a href="#" id="switchLink">تسجيل الدخول هنا</a>';
  });

  // Handle login/register form submission
  loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailOrPhone = document.getElementById('emailOrPhone').value;

      // Validate email or phone
      if (!validateEmailOrPhone(emailOrPhone)) {
          alert('الرجاء إدخال بريد إلكتروني أو رقم هاتف صحيح.');
          return;
      }

      // Simulate sending OTP (in a real app, this would call a backend API)
      otp = generateOTP();
      alert(`تم إرسال رمز التحقق إلى ${emailOrPhone}: ${otp}`);

      // Show OTP form
      loginForm.style.display = 'none';
      otpForm.style.display = 'block';
  });

  // Handle OTP form submission
  otpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredOTP = document.getElementById('otp').value;
      if (enteredOTP === otp) {
          alert(isLogin ? 'تم تسجيل الدخول بنجاح!' : 'تم التسجيل بنجاح!');
          window.location.href = isLogin ? '../client/clients.html' : '../client/clients.html'; // Redirect to the main page
      } else {
          alert('رمز التحقق غير صحيح. الرجاء المحاولة مرة أخرى.');
      }
  });

  // Validate email or phone
  const validateEmailOrPhone = (input) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10}$/; // Simple 10-digit phone number validation
      return emailRegex.test(input) || phoneRegex.test(input);
  };

  // Generate a 6-digit OTP
  const generateOTP = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
  };
});