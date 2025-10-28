export function renderTermsPage() {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-white py-16';
  
  container.innerHTML = `
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="card">
        <h1 class="text-3xl font-bold text-neutral-800 mb-6">Terms & Conditions</h1>
        <div class="prose prose-neutral max-w-none">
          <p class="lead">Last updated: October 28, 2025</p>
          <p>Please read these terms and conditions carefully before using Our Service.</p>
          
          <h2>Interpretation and Definitions</h2>
          <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
          
          <h2>Acknowledgment</h2>
          <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
          <p>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>
          
          <h2>User Accounts</h2>
          <p>When You create an account with Us, You must provide Us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of Your account on Our Service.</p>
          <p>You are responsible for safeguarding the password that You use to access the Service and for any activities or actions under Your password, whether Your password is with Our Service or a Third-Party Social Media Service.</p>

          <h2>Orders and Pricing</h2>
          <p>All orders are subject to acceptance and availability. We reserve the right to refuse or cancel an order for any reason, including limitations on quantities available for purchase, inaccuracies, or errors in product or pricing information.</p>
          <p>Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.</p>

          <h2>Contact Us</h2>
          <p>If you have any questions about these Terms and Conditions, You can contact us by email: business@slns.in</p>
        </div>
      </div>
    </div>
  `;
  
  return container;
}
