import EditorialInfoPage from '../../components/EditorialInfoPage';

export const metadata = {
  title: 'Contact Us | UNRULY',
  description: 'Get in touch with the UNRULY customer-care team.',
};

const sections = [
  {
    id: 'contact-details',
    title: 'Get in touch',
    subtitle: 'Choose the right inbox and include your order number when relevant.',
    items: [
      {
        label: 'General inquiries',
        content: <a href="mailto:hello@ssikamore.com">hello@ssikamore.com</a>,
      },
      {
        label: 'Logistics & shipping',
        content: <a href="mailto:shipping@ssikamore.com">shipping@ssikamore.com</a>,
      },
      {
        label: 'Client services',
        content: <a href="mailto:support@ssikamore.com">support@ssikamore.com</a>,
      },
    ],
  },
  {
    id: 'contact-help',
    title: 'Before you write',
    subtitle: 'A few details can help us direct your question.',
    items: [
      {
        question: 'What should I include about an existing order?',
        answer:
          'Please include the name and email address used at checkout, your order number if available, and a short description of how we can help.',
      },
      {
        question: 'Where can I find delivery, refund and payment information?',
        answer: (
          <>
            Visit our <a href="/shipping#shipping">shipping</a>,{' '}
            <a href="/shipping#returns">refunds and returns</a>, and{' '}
            <a href="/shipping#payments">payment</a> policy sections.
          </>
        ),
      },
    ],
  },
];

export default function ContactPage() {
  return (
    <EditorialInfoPage
      eyebrow="UNRULY® / CUSTOMER CARE"
      title="We’re here to help."
      intro="For questions about a piece, an order, or anything else, reach out to the team and we’ll point you in the right direction."
      navigation={[
        { href: '#contact-details', label: 'Contact details' },
        { href: '#contact-help', label: 'Before you write' },
      ]}
      sections={sections}
      callout={{
        eyebrow: 'UNRULY CUSTOMER CARE',
        title: 'Start a conversation.',
        description: 'Send your question to our team by email.',
        actions: [
          { href: 'mailto:hello@ssikamore.com', label: 'Email customer care' },
          { href: '/shipping', label: 'Read our policies', secondary: true },
        ],
      }}
    />
  );
}
