import EditorialInfoPage from '../../components/EditorialInfoPage';

const sections = [
  {
    id: 'returns',
    title: 'Refunds & exchanges',
    subtitle: 'A considered process for every UNRULY order.',
    items: [
      {
        question: 'How do I request a return or exchange?',
        answer:
          'Email hello@ssikamore.com with your order number, the item you are enquiring about, and whether you are seeking a return or exchange. Please contact us before sending an item back; our team will confirm the next steps for your request.',
      },
      {
        question: 'When is a refund or exchange approved?',
        answer:
          'Each request is reviewed individually, taking the order details and applicable consumer protections into account. We will confirm whether your request can proceed and provide any item condition or return instructions before you send anything.',
      },
      {
        question: 'How are approved refunds issued?',
        answer:
          'Where a refund is approved, it is issued to the original payment method where supported by the payment provider. The time it takes to appear may depend on your bank or provider. Our team will share an update if you contact us about its status.',
      },
    ],
  },
  {
    id: 'shipping',
    title: 'Shipping',
    subtitle: 'Delivery details, made clear before checkout.',
    items: [
      {
        question: 'Where do you deliver, and what does shipping cost?',
        answer:
          'Available destinations, delivery options and the applicable fee are shown in the delivery selector and checkout flow for your location. Review the selected destination and shipping charge before you complete payment.',
      },
      {
        question: 'When will my order arrive?',
        answer:
          'Delivery timing depends on the destination and delivery service. For an estimate before ordering, or an update on an existing order, email hello@ssikamore.com with your destination or order number.',
      },
      {
        question: 'Can I change my delivery details?',
        answer:
          'If you need to correct a delivery detail, contact us as soon as possible with your order number. Changes may not be possible once an order is being prepared for dispatch or is already in transit.',
      },
    ],
  },
  {
    id: 'payments',
    title: 'Payment',
    subtitle: 'A clear and secure checkout experience.',
    items: [
      {
        question: 'How do I pay for my order?',
        answer:
          'Payments are completed through the secure Paystack checkout. Enter your payment details only in the checkout provided by Paystack; UNRULY will never ask you to send card details by email or direct message.',
      },
      {
        question: 'Which currencies and payment options can I use?',
        answer:
          'Checkout currently supports Nigerian naira (NGN) and US dollars (USD), depending on your selected destination and order. The payment options available for your transaction are displayed by Paystack at checkout.',
      },
      {
        question: 'What if payment is pending or I see a duplicate charge?',
        answer:
          'Check your order confirmation first. If payment appears pending, or you see a charge without an order confirmation, contact hello@ssikamore.com with your checkout email and payment reference so we can help investigate.',
      },
    ],
  },
];

export const metadata = {
  title: 'Refunds, Shipping & Payment | UNRULY',
  description: 'UNRULY customer-care policies for returns, delivery and payments.',
};

export default function ShippingPage() {
  return (
    <EditorialInfoPage
      eyebrow="UNRULY® / CUSTOMER CARE"
      title="Information, without the noise."
      intro="The details on refunds, delivery and payment for shopping UNRULY. If you need help with a specific order, our team is here to help."
      navigation={[
        { href: '#returns', label: 'Refunds & exchanges' },
        { href: '#shipping', label: 'Shipping' },
        { href: '#payments', label: 'Payment' },
      ]}
      sections={sections}
      callout={{
        eyebrow: 'HERE WHEN YOU NEED US',
        title: 'Questions about an order?',
        description: 'Include your order number and we’ll help you find the right next step.',
        actions: [
          { href: 'mailto:hello@ssikamore.com', label: 'Contact customer care' },
          { href: '/shop', label: 'Continue shopping', secondary: true },
        ],
      }}
    />
  );
}
