import prisma from "../prisma";

export async function seedCategories() {
    await prisma.category.upsert({
        where: {
            slug: "electrical",
        },
        update: {
            icon: "electrical_services",
        },
        create: {
            name: "Electrical",
            slug: "electrical",
            description:
                "Electrical installation, repair and maintenance services.",
            icon: "electrical_services",
            displayOrder: 1,
        },
    });

    await prisma.category.upsert({
        where: {
            slug: "plumbing",
        },
        update: {
            icon: "plumbing",
        },
        create: {
            name: "Plumbing",
            slug: "plumbing",
            description:
                "Plumbing installation, repair and maintenance services.",
            icon: "plumbing",
            displayOrder: 2,
        },
    });

    await prisma.category.upsert({
        where: {
            slug: "cleaning",
        },
        update: {
            icon: "cleaning_services",
        },
        create: {
            name: "Cleaning",
            slug: "cleaning",
            description:
                "Home and property cleaning services.",
            icon: "cleaning_services",
            displayOrder: 3,
        },
    });

    await prisma.category.upsert({
        where: {
            slug: "painting",
        },
        update: {
            icon: "format_paint",
        },
        create: {
            name: "Painting",
            slug: "painting",
            description:
                "Interior and exterior painting services.",
            icon: "format_paint",
            displayOrder: 4,
        },
    });

    await prisma.category.upsert({
        where: {
            slug: "carpentry",
        },
        update: {
            icon: "carpenter",
        },
        create: {
            name: "Carpentry",
            slug: "carpentry",
            description:
                "Carpentry, furniture and woodwork services.",
            icon: "carpenter",
            displayOrder: 5,
        },
    });

    await prisma.category.upsert({
        where: {
            slug: "ac-appliance",
        },
        update: {
            icon: "ac_unit",
        },
        create: {
            name: "AC & Appliance",
            slug: "ac-appliance",
            description:
                "AC and home appliance installation and repair services.",
            icon: "ac_unit",
            displayOrder: 6,
        },
    });

    console.log("Categories seeded successfully.");
}