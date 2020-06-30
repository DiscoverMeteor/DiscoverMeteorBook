globalDiscountCode = "";
globalDiscountPercentage = "";

// Note: products and packages are defined independantly. 
products = [
  {
    id: 1,
    code: 'book',
    gumroadCode: 'eDzA', 
    name: 'The Book',
    description: "Get the whole book, including 14 chapters and 11 sidebars.",
    points: 10,
    price: 29
  },
  {
    id: 2,
    code: 'full',
    gumroadCode: 'ZjlD', 
    name: 'Full Edition',
    description: "Get the <strong>four extra chapters</strong>, as well as four screencasts and interviews with Matt Debergalis and Andrew Wilcox.",
    points: 100,
    price: 89
  },
  {
    id: 3,
    code: 'premium',
    gumroadCode: 'OwKC', 
    name: 'Premium Edition',
    description: "All of the Full Edition's contents plus <strong>a Discover Meteor t-shirt</strong>, and additional interviews with Avital Oliver and Nick Martin.",
    points: 1000,
    price: 179
  },
  {
    id: 4, 
    code: 'book_to_full',
    gumroadCode: 'Bqld', 
    name: 'Upgrade to the Full Edition',
    description: "Get the <strong>four extra chapters</strong>, as well as four screencasts and interviews with Matt Debergalis and Andrew Wilcox.",
    from: 10,
    points: 90,
    price: 50,
    upgrade: true
  },
  {
    id: 5, 
    code: 'book_to_premium',
    gumroadCode: 'zIux', 
    name: 'Upgrade to the Premium Edition',
    description: "All of the Full Edition's contents plus <strong>a Discover Meteor t-shirt</strong>, and additional interviews with Avital Oliver and Nick Martin.",
    from: 10,
    points: 990,
    price: 140,
    upgrade: true
  },
  {
    id: 6,
    code: 'full_to_premium',
    gumroadCode: 'GPah', 
    name: 'Upgrade to the Premium Edition',
    description: "All of the Full Edition's contents plus <strong>a Discover Meteor t-shirt</strong>, and additional interviews with Avital Oliver and Nick Martin.",    
    from: 100,
    points: 900,
    price: 90,
    upgrade: true
  },
  {
    id: 7,
    code: 'team',
    gumroadCode: 'mNzU', 
    name: 'Team Edition',
    points: 1000
  },
  {
    id: 8,
    code: 'limited',
    gumroadCode: 'KsWKZ',
    name: 'Limited Edition',
    points: 5
  },
  { // use for team purchases
    id: 9,
    code: 'team-member',
    gumroadCode: 'wnNd',
    name: 'Team Edition',
    points: 1000
  },
  {
    id: 10,
    code: 'starter',
    name: 'Starter Edition',
    points: 5
  },
  {
    id: 11,
    code: 'starter_to_book',
    gumroadCode: 'vOhG',
    name: 'Upgrade to the Book',
    description: "Get the whole book, including 14 chapters and 11 sidebars.",
    from: 5,
    points: 5,
    price: 29,
    upgrade: true
  },
  {
    id: 11,
    code: 'starter_to_full',
    gumroadCode: 'XiZOm',
    name: 'Upgrade to the Full Edition',
    description: "Get the <strong>four extra chapters</strong>, as well as four screencasts and interviews with Matt Debergalis and Andrew Wilcox.",    
    from: 5,
    points: 95,
    price: 89,
    upgrade: true
  },
  {
    id: 11,
    code: 'starter_to_premium',
    gumroadCode: 'aWgr',
    name: 'Upgrade to the Premium Edition',
    description: "All of the Full Edition's contents plus <strong>a Discover Meteor t-shirt</strong>, and additional interviews with Avital Oliver and Nick Martin.",        
    from: 5,
    points: 995,
    price: 179,
    upgrade: true
  }
];