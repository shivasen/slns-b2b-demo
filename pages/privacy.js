export function renderPrivacyPage() {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-white py-16';
  
  container.innerHTML = `
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="card">
        <h1 class="text-3xl font-bold text-neutral-800 mb-6">Privacy Policy</h1>
        <div class="prose prose-neutral max-w-none">
          <p class="lead">Last updated: October 28, 2025</p>
          <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
          
          <h2>Collecting and Using Your Personal Data</h2>
          <h3>Types of Data Collected</h3>
          <h4>Personal Data</h4>
          <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to: Email address, First name and last name, Phone number, Address, State, Province, ZIP/Postal code, City, Business Information (GSTIN).</p>
          
          <h4>Usage Data</h4>
          <p>Usage Data is collected automatically when using the Service. Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
          
          <h2>Use of Your Personal Data</h2>
          <p>The Company may use Personal Data for the following purposes:</p>
          <ul>
            <li>To provide and maintain our Service, including to monitor the usage of our Service.</li>
            <li>To manage Your Account: to manage Your registration as a user of the Service.</li>
            <li>For the performance of a contract: the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased.</li>
            <li>To contact You: To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication.</li>
          </ul>

          <h2>Security of Your Personal Data</h2>
          <p>The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.</p>
          
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, You can contact us by email: business@slns.in</p>
        </div>
      </div>
    </div>
  `;
  
  return container;
}
