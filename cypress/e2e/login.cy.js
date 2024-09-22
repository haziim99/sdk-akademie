describe('Login Page Tests', () => {
  beforeEach(() => {
    // اعتراض طلب المستخدمين من ملف JSON
    cy.intercept('GET', 'assets/user.json', { fixture: 'user.json' }).as('getUsers');
    // زيارة صفحة تسجيل الدخول
    cy.visit('/login');
  });

  it('should display the login form', () => {
    cy.get('form').should('be.visible');
  });

  it('should show error when email or password is empty', () => {
    cy.get('button[type="submit"]').click();
    cy.get('.swal2-title').should('contain.text', 'Input Required');
    cy.get('.swal2-confirm').click(); // تأكيد الرسالة المنبثقة تلقائيًا

  });

  it('should display an error message for incorrect credentials', () => {
    // إدخال بيانات خاطئة
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // الانتظار حتى يتم إرسال الطلب
    cy.wait('@getUsers').then(() => {
      cy.get('.swal2-title').should('contain.text', 'Login Failed');
    });
  });

  it('should redirect to the correct URL after successful login', () => {
    // إدخال بيانات صحيحة
    cy.get('input[name="email"]').type('ahmed@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // الانتظار حتى يتم إرسال الطلب
    cy.wait('@getUsers').then(() => {
      cy.get('.swal2-confirm').click(); // تأكيد الرسالة المنبثقة تلقائيًا
      cy.url().should('include', '/profile'); // تأكد من التوجيه إلى صفحة الملف الشخصي

      // تأكد من ظهور رسالة تسجيل الدخول الناجح
      cy.get('.swal2-title').should('contain.text', 'Login Successful');
    });
  });

  it('should redirect to register page when "Register" link is clicked', () => {
    cy.get('.register-link a').click();
    cy.url().should('include', '/register');
  });
});
