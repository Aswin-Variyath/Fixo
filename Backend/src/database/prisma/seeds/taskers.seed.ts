import argon2 from "argon2";
import prisma from "../prisma";
import { DayOfWeek } from "../../generated/prisma/enums";

const TEST_PASSWORD = "FixoTest@2026";

const CUSTOMER_LOCATION = {
  latitude: "11.310136",
  longitude: "75.898945",
};

const taskers = [
  {
    firstName: "Arun",
    lastName: "Kumar",
    email: "arun.tasker@fixo.dev",
    phone: "9000000001",
    latitude: "11.312636",
    longitude: "75.898945",
    experienceYears: 6,
    averageRating: 4.8,
    totalReviews: 42,
    addressLine: "Koyilandy Road",
  },
  {
    firstName: "Rahul",
    lastName: "Das",
    email: "rahul.tasker@fixo.dev",
    phone: "9000000002",
    latitude: "11.307636",
    longitude: "75.898945",
    experienceYears: 5,
    averageRating: 4.7,
    totalReviews: 35,
    addressLine: "Moozhikkal Road",
  },
  {
    firstName: "Vishnu",
    lastName: "Raj",
    email: "vishnu.tasker@fixo.dev",
    phone: "9000000003",
    latitude: "11.310136",
    longitude: "75.902045",
    experienceYears: 8,
    averageRating: 4.9,
    totalReviews: 58,
    addressLine: "Kakkayam Road",
  },
  {
    firstName: "Nikhil",
    lastName: "Babu",
    email: "nikhil.tasker@fixo.dev",
    phone: "9000000004",
    latitude: "11.310136",
    longitude: "75.895845",
    experienceYears: 4,
    averageRating: 4.6,
    totalReviews: 27,
    addressLine: "West Hill Road",
  },
  {
    firstName: "Sreejith",
    lastName: "M",
    email: "sreejith.tasker@fixo.dev",
    phone: "9000000005",
    latitude: "11.315136",
    longitude: "75.898945",
    experienceYears: 7,
    averageRating: 4.8,
    totalReviews: 49,
    addressLine: "Eranhipalam Road",
  },
  {
    firstName: "Akhil",
    lastName: "Prasad",
    email: "akhil.tasker@fixo.dev",
    phone: "9000000006",
    latitude: "11.305136",
    longitude: "75.898945",
    experienceYears: 3,
    averageRating: 4.5,
    totalReviews: 19,
    addressLine: "Nadakkavu Road",
  },
  {
    firstName: "Jithin",
    lastName: "Jose",
    email: "jithin.tasker@fixo.dev",
    phone: "9000000007",
    latitude: "11.310136",
    longitude: "75.905145",
    experienceYears: 9,
    averageRating: 4.9,
    totalReviews: 67,
    addressLine: "Kallai Road",
  },
  {
    firstName: "Manu",
    lastName: "Thomas",
    email: "manu.tasker@fixo.dev",
    phone: "9000000008",
    latitude: "11.310136",
    longitude: "75.892745",
    experienceYears: 6,
    averageRating: 4.7,
    totalReviews: 38,
    addressLine: "Pottammal Road",
  },
  {
    firstName: "Shyam",
    lastName: "Krishnan",
    email: "shyam.tasker@fixo.dev",
    phone: "9000000009",
    latitude: "11.317136",
    longitude: "75.898945",
    experienceYears: 10,
    averageRating: 4.9,
    totalReviews: 81,
    addressLine: "Vellimadukunnu Road",
  },
  {
    firstName: "Fahad",
    lastName: "Ali",
    email: "fahad.tasker@fixo.dev",
    phone: "9000000010",
    latitude: "11.303136",
    longitude: "75.898945",
    experienceYears: 5,
    averageRating: 4.6,
    totalReviews: 31,
    addressLine: "Chevayur Road",
  },
  {
    firstName: "Rakesh",
    lastName: "P",
    email: "rakesh.tasker@fixo.dev",
    phone: "9000000011",
    latitude: "11.310136",
    longitude: "75.910145",
    experienceYears: 7,
    averageRating: 4.8,
    totalReviews: 46,
    addressLine: "Kunnamangalam Road",
  },
  {
    firstName: "Naveen",
    lastName: "K",
    email: "naveen.tasker@fixo.dev",
    phone: "9000000012",
    latitude: "11.310136",
    longitude: "75.887745",
    experienceYears: 4,
    averageRating: 4.5,
    totalReviews: 22,
    addressLine: "Medical College Road",
  },
];

const availability: {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}[] = [
  {
    dayOfWeek: DayOfWeek.MONDAY,
    startTime: "09:00",
    endTime: "18:00",
  },
  {
    dayOfWeek: DayOfWeek.TUESDAY,
    startTime: "09:00",
    endTime: "18:00",
  },
  {
    dayOfWeek: DayOfWeek.WEDNESDAY,
    startTime: "09:00",
    endTime: "18:00",
  },
  {
    dayOfWeek: DayOfWeek.THURSDAY,
    startTime: "09:00",
    endTime: "18:00",
  },
  {
    dayOfWeek: DayOfWeek.FRIDAY,
    startTime: "09:00",
    endTime: "18:00",
  },
  {
    dayOfWeek: DayOfWeek.SATURDAY,
    startTime: "09:00",
    endTime: "18:00",
  },
];

async function findOrCreateUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  languageId: string;
  statusId: string;
}) {
  const userByEmail = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  const userByPhone = await prisma.user.findUnique({
    where: {
      phone: data.phone,
    },
  });

  if (userByEmail && userByPhone && userByEmail.id !== userByPhone.id) {
    throw new Error(
      `User conflict: email "${data.email}" and phone "${data.phone}" belong to different users.`,
    );
  }

  const existingUser = userByEmail ?? userByPhone;

  if (existingUser) {
    return prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        languageId: data.languageId,
        statusId: data.statusId,
        password: data.password,
      },
    });
  }

  return prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      languageId: data.languageId,
      statusId: data.statusId,
    },
  });
}

export async function seedTaskers() {
  const englishLanguage = await prisma.language.findUnique({
    where: {
      type: "en",
    },
  });

  const activeStatus = await prisma.userStatus.findUnique({
    where: {
      type: "active",
    },
  });

  const taskerRole = await prisma.role.findUnique({
    where: {
      type: "tasker",
    },
  });

  const customerRole = await prisma.role.findUnique({
    where: {
      type: "customer",
    },
  });

  if (!englishLanguage) {
    throw new Error("English language not found.");
  }

  if (!activeStatus) {
    throw new Error("Active user status not found.");
  }

  if (!taskerRole) {
    throw new Error("Tasker role not found.");
  }

  if (!customerRole) {
    throw new Error("Customer role not found.");
  }

  const pipeLeakageRepair = await prisma.service.findUnique({
    where: {
      slug: "pipe-leakage-repair",
    },
  });

  const tapRepair = await prisma.service.findUnique({
    where: {
      slug: "tap-repair",
    },
  });

  const bathroomPlumbing = await prisma.service.findUnique({
    where: {
      slug: "bathroom-plumbing",
    },
  });

  const waterTankInstallation = await prisma.service.findUnique({
    where: {
      slug: "water-tank-installation",
    },
  });

  if (
    !pipeLeakageRepair ||
    !tapRepair ||
    !bathroomPlumbing ||
    !waterTankInstallation
  ) {
    throw new Error("Required plumbing services not found.");
  }

  const passwordHash = await argon2.hash(TEST_PASSWORD, {
    type: argon2.argon2id,
  });

  /*
   * ---------------------------------------------------------
   * Seed test customer
   * ---------------------------------------------------------
   */

  const customer = await findOrCreateUser({
    firstName: "Rahul",
    lastName: "Menon",
    email: "test.customer@fixo.dev",
    phone: "9000000100",
    password: passwordHash,
    languageId: englishLanguage.id,
    statusId: activeStatus.id,
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: customer.id,
        roleId: customerRole.id,
      },
    },
    update: {},
    create: {
      userId: customer.id,
      roleId: customerRole.id,
    },
  });

  const existingCustomerAddress = await prisma.customerAddress.findFirst({
    where: {
      userId: customer.id,
      label: "Home",
    },
  });

  if (existingCustomerAddress) {
    await prisma.customerAddress.update({
      where: {
        id: existingCustomerAddress.id,
      },
      data: {
        addressLine: "Test Customer Location",
        city: "Kozhikode",
        state: "Kerala",
        postalCode: "673001",
        country: "India",
        latitude: CUSTOMER_LOCATION.latitude,
        longitude: CUSTOMER_LOCATION.longitude,
        isDefault: true,
      },
    });
  } else {
    await prisma.customerAddress.create({
      data: {
        userId: customer.id,
        label: "Home",
        addressLine: "Test Customer Location",
        city: "Kozhikode",
        state: "Kerala",
        postalCode: "673001",
        country: "India",
        latitude: CUSTOMER_LOCATION.latitude,
        longitude: CUSTOMER_LOCATION.longitude,
        isDefault: true,
      },
    });
  }

  /*
   * ---------------------------------------------------------
   * Seed taskers
   * ---------------------------------------------------------
   */

  for (let index = 0; index < taskers.length; index++) {
    const tasker = taskers[index];

    const user = await findOrCreateUser({
      firstName: tasker.firstName,
      lastName: tasker.lastName,
      email: tasker.email,
      phone: tasker.phone,
      password: passwordHash,
      languageId: englishLanguage.id,
      statusId: activeStatus.id,
    });

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: taskerRole.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: taskerRole.id,
      },
    });

    const profile = await prisma.taskerProfile.upsert({
      where: {
        userId: user.id,
      },
      update: {
        bio: `${tasker.firstName} provides professional plumbing services.`,
        experienceYears: tasker.experienceYears,
        averageRating: tasker.averageRating,
        totalReviews: tasker.totalReviews,
        profileStatus: "COMPLETE",
      },
      create: {
        userId: user.id,
        bio: `${tasker.firstName} provides professional plumbing services.`,
        experienceYears: tasker.experienceYears,
        averageRating: tasker.averageRating,
        totalReviews: tasker.totalReviews,
        profileStatus: "COMPLETE",
      },
    });

    await prisma.taskerLocation.upsert({
      where: {
        taskerProfileId: profile.id,
      },
      update: {
        addressLine: tasker.addressLine,
        city: "Kozhikode",
        state: "Kerala",
        postalCode: "673001",
        country: "India",
        latitude: tasker.latitude,
        longitude: tasker.longitude,
        serviceRadiusKm: "10.00",
      },
      create: {
        taskerProfileId: profile.id,
        addressLine: tasker.addressLine,
        city: "Kozhikode",
        state: "Kerala",
        postalCode: "673001",
        country: "India",
        latitude: tasker.latitude,
        longitude: tasker.longitude,
        serviceRadiusKm: "10.00",
      },
    });

    const additionalServices =
      index % 4 === 0
        ? [tapRepair]
        : index % 4 === 1
          ? [bathroomPlumbing]
          : index % 4 === 2
            ? [waterTankInstallation]
            : [tapRepair, bathroomPlumbing];

    const services = [pipeLeakageRepair, ...additionalServices];

    for (const service of services) {
      await prisma.taskerServiceOffering.upsert({
        where: {
          taskerProfileId_serviceId: {
            taskerProfileId: profile.id,
            serviceId: service.id,
          },
        },
        update: {
          hourlyRate: "500.00",
          dailyRate: "2500.00",
          status: "ACTIVE",
        },
        create: {
          taskerProfileId: profile.id,
          serviceId: service.id,
          hourlyRate: "500.00",
          dailyRate: "2500.00",
          status: "ACTIVE",
        },
      });
    }

    for (const slot of availability) {
      await prisma.taskerAvailability.upsert({
        where: {
          taskerProfileId_dayOfWeek_startTime_endTime: {
            taskerProfileId: profile.id,
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
          },
        },
        update: {
          status: "ACTIVE",
        },
        create: {
          taskerProfileId: profile.id,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: "ACTIVE",
        },
      });
    }
  }

  console.log("Customer and taskers seeded successfully.");
  console.log("Customer: test.customer@fixo.dev");
  console.log(`Test password: ${TEST_PASSWORD}`);
  console.log(`Taskers seeded: ${taskers.length}`);
}