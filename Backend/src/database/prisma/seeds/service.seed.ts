import prisma from "../prisma";

export async function seedServices() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      slug: true,
    },
  });

  const categoryMap = new Map(
    categories.map((category) => [category.slug, category.id])
  );

  const services = [
    // Electrical
    {
      categorySlug: "electrical",
      name: "Fan Installation",
      slug: "fan-installation",
      description:
        "Installation and replacement of ceiling and wall fans.",
      displayOrder: 1,
    },
    {
      categorySlug: "electrical",
      name: "Light Installation",
      slug: "light-installation",
      description:
        "Installation and replacement of lights and lighting fixtures.",
      displayOrder: 2,
    },
    {
      categorySlug: "electrical",
      name: "Switch & Socket Repair",
      slug: "switch-socket-repair",
      description:
        "Repair and replacement of switches and electrical sockets.",
      displayOrder: 3,
    },
    {
      categorySlug: "electrical",
      name: "Home Wiring",
      slug: "home-wiring",
      description:
        "Electrical wiring and rewiring services for homes.",
      displayOrder: 4,
    },

    // Plumbing
    {
      categorySlug: "plumbing",
      name: "Tap Repair",
      slug: "tap-repair",
      description:
        "Repair and replacement of household taps and faucets.",
      displayOrder: 1,
    },
    {
      categorySlug: "plumbing",
      name: "Pipe Leakage Repair",
      slug: "pipe-leakage-repair",
      description:
        "Detection and repair of water pipe leaks.",
      displayOrder: 2,
    },
    {
      categorySlug: "plumbing",
      name: "Bathroom Plumbing",
      slug: "bathroom-plumbing",
      description:
        "Bathroom plumbing installation and repair services.",
      displayOrder: 3,
    },
    {
      categorySlug: "plumbing",
      name: "Water Tank Installation",
      slug: "water-tank-installation",
      description:
        "Installation and replacement of household water tanks.",
      displayOrder: 4,
    },

    // Cleaning
    {
      categorySlug: "cleaning",
      name: "Sofa Cleaning",
      slug: "sofa-cleaning",
      description:
        "Professional sofa and upholstery cleaning services.",
      displayOrder: 1,
    },
    {
      categorySlug: "cleaning",
      name: "Bathroom Cleaning",
      slug: "bathroom-cleaning",
      description:
        "Professional bathroom cleaning services.",
      displayOrder: 2,
    },
    {
      categorySlug: "cleaning",
      name: "Kitchen Cleaning",
      slug: "kitchen-cleaning",
      description:
        "Professional kitchen cleaning services.",
      displayOrder: 3,
    },
    {
      categorySlug: "cleaning",
      name: "Home Deep Cleaning",
      slug: "home-deep-cleaning",
      description:
        "Complete deep cleaning services for homes.",
      displayOrder: 4,
    },

    // Painting
    {
      categorySlug: "painting",
      name: "Interior Painting",
      slug: "interior-painting",
      description:
        "Interior wall and room painting services.",
      displayOrder: 1,
    },
    {
      categorySlug: "painting",
      name: "Exterior Painting",
      slug: "exterior-painting",
      description:
        "Exterior wall and building painting services.",
      displayOrder: 2,
    },

    // Carpentry
    {
      categorySlug: "carpentry",
      name: "Furniture Repair",
      slug: "furniture-repair",
      description:
        "Repair and maintenance of household furniture.",
      displayOrder: 1,
    },
    {
      categorySlug: "carpentry",
      name: "Door Repair",
      slug: "door-repair",
      description:
        "Door repair, adjustment and replacement services.",
      displayOrder: 2,
    },

    // AC & Appliance
    {
      categorySlug: "ac-appliance",
      name: "AC Installation",
      slug: "ac-installation",
      description:
        "Installation of residential air conditioning units.",
      displayOrder: 1,
    },
    {
      categorySlug: "ac-appliance",
      name: "AC Repair",
      slug: "ac-repair",
      description:
        "Air conditioner inspection, maintenance and repair.",
      displayOrder: 2,
    },
    {
      categorySlug: "ac-appliance",
      name: "Washing Machine Repair",
      slug: "washing-machine-repair",
      description:
        "Washing machine inspection and repair services.",
      displayOrder: 3,
    },
  ];

  for (const service of services) {
    const categoryId = categoryMap.get(service.categorySlug);

    if (!categoryId) {
      throw new Error(
        `Category not found for service: ${service.name}`
      );
    }

    await prisma.service.upsert({
      where: {
        slug: service.slug,
      },
      update: {
        categoryId,
        name: service.name,
        description: service.description,
        displayOrder: service.displayOrder,
      },
      create: {
        categoryId,
        name: service.name,
        slug: service.slug,
        description: service.description,
        displayOrder: service.displayOrder,
      },
    });
  }

  console.log("Services seeded successfully.");
}