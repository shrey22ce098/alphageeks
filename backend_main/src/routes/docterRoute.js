import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import {
  authenticateUser,
  authorizeRoles,
} from "../middlewares/authMiddlewer.js";

const router = express.Router();
const prisma = new PrismaClient();

//  Register a doctor (Only for authenticated users)

router.post(
  "/register",
  authenticateUser,
  authorizeRoles(["doctor"]),
  async (req, res) => {
    try {
      const { licenseId, profileImage, bio, city, state, address, maplink } =
        req.body;
      const userId = req.user.userId; // Get user ID from authenticated request
      console.log("userid----", req.user);
      const timge =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH5sFjZPx1Yzi1b9_FpQzrxqgsjv2DPAp81Q&s";

      // ✅ Check if the user is already registered as a doctor
      const existingDoctor = await prisma.doctor.findFirst({
        where: {
          OR: [{ useraId: userId }, { licenseId: licenseId }],
        },
      });

      if (existingDoctor) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "License ID already exists. Use a unique License ID. or doctor is already registered",
          });
      }

      // Check if city exists, create if it doesn't
      let cityRecord;
      if (city) {
        cityRecord = await prisma.city.findUnique({
          where: { name: city },
        });

        if (!cityRecord) {
          // Create new city entry
          cityRecord = await prisma.city.create({
            data: {
              name: city,
              state: state,
              country: "India", // Using the default value
            },
          });
        }
      }

      // ✅ Create the doctor entry
      const newDoctor = await prisma.doctor.create({
        data: {
          licenseId,
          profileImage: timge,
          bio,
          city,
          state,
          address,
          isVerified: true,
          isActive: true,
          maplink,
          usera: {
            connect: { id: userId },
          },
        },
      });

      res.status(201).json({ success: true, doctor: newDoctor });
    } catch (error) {
      console.error("Doctor registration error:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Doctor registration failed",
          error: error.message,
        });
    }
  }
);

//add langvage
router.post(
  "/addlangvage",
  authenticateUser,
  authorizeRoles(["doctor"]),
  async (req, res) => {
    try {
      // const { id } = req.params;
      const { languages } = req.body;
      const userId = req.user.userId;
      const doctor = await prisma.usera.findUnique({
        where: { id: userId },
        include: { doctor: true },
      });

      // Check if doctor exists
      // const doctor = await prisma.doctor.findUnique({
      //   where: { id }
      // });

      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }

      // Process languages
      const results = await prisma.$transaction(async (tx) => {
        const createdEntries = [];

        for (const lang of languages) {
          // Get or create language
          let language = await tx.language.findUnique({
            where: { code: lang.code },
          });

          if (!language) {
            language = await tx.language.create({
              data: {
                name: lang.name,
                code: lang.code,
              },
            });
          }
          const did = doctor?.doctor?.id;
          console.log("did", did);

          // Check if this doctor-language combination already exists
          const existing = await tx.doctorLanguage.findFirst({
            where: {
              doctorId: doctor?.doctor?.id,
              languageId: language.id,
            },
          });

          if (existing) {
            // Update fluency if provided
            if (lang.fluency) {
              await tx.doctorLanguage.update({
                where: { id: existing.id },
                data: { fluency: lang.fluency },
              });
            }
          } else {
            // Create new entry
            const created = await tx.doctorLanguage.create({
              data: {
                doctorId: doctor?.doctor?.id,
                languageId: language.id,
                fluency: lang.fluency,
              },
            });
            createdEntries.push(created);
          }
        }

        return createdEntries;
      });

      res.status(201).json({
        message: `Added ${results.length} languages to doctor`,
        data: results,
      });
    } catch (error) {
      console.error("Error adding languages to doctor:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

//addspcialztion
router.post(
  "/addspcialztion",
  authenticateUser,
  authorizeRoles(["doctor"]),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const doctor = await prisma.usera.findUnique({
        where: { id: userId },
        include: { doctor: true },
      });
      const { specializations } = req.body;

      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }

      // Process specializations
      const results = await prisma.$transaction(async (tx) => {
        const createdEntries = [];

        for (const spec of specializations) {
          // Get or create specialization
          let specialization = await tx.specialization.findUnique({
            where: { name: spec.name },
          });

          if (!specialization) {
            specialization = await tx.specialization.create({
              data: {
                name: spec.name,
                description: spec.description || null,
              },
            });
          }
          const did = doctor?.doctor?.id;
          console.log("did", did);
          // Check if this doctor-specialization combination already exists
          const existing = await tx.doctorSpecialization.findFirst({
            where: {
              doctorId: did,
              specializationId: specialization.id || null,
            },
          });

          if (existing) {
            // Update isPrimary if provided
            if (spec.isPrimary !== undefined) {
              await tx.doctorSpecialization.update({
                where: { id: existing.id },
                data: { isPrimary: spec.isPrimary },
              });
            }
          } else {
            // Create new entry
            const created = await tx.doctorSpecialization.create({
              data: {
                doctorId: did,
                specializationId: specialization.id,
                isPrimary: spec.isPrimary || false,
              },
            });
            createdEntries.push(created);
          }
        }

        return createdEntries;
      });

      res.status(201).json({
        message: `Added ${results.length} specializations to doctor`,
        data: results,
      });
    } catch (error) {
      console.error("Error adding specializations to doctor:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// get detaildoctore
router.get(
  "/detaildoctor",
  authenticateUser,
  authorizeRoles(["doctor"]),
  async (req, res) => {
    try {
      const userId = req.user.userId;

      const doctor = await prisma.usera.findUnique({
        where: { id: userId },
        include: {
          doctor: {
            include: {
              specializations: {
                include: {
                  specialization: true,
                },
              },
              doctorLanguages: {
                include: {
                  language: true,
                },
              },
              education: true,
            },
          },
        },
      });

      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }

      // Format response
      // const formattedDoctor = {
      //   id: doctor.id,
      //   name: doctor.name,
      //   licenseId: doctor.licenseId,
      //   bio: doctor.bio,
      //   isVerified: doctor.isVerified,
      //   city: doctor.city,
      //   state: doctor.state,
      //   specializations: doctor.specializations.map(sp => ({
      //     id: sp.specialization.id,
      //     name: sp.specialization.name,
      //     isPrimary: sp.isPrimary,
      //   consultationFees:sp.consultationFees || '0'
      //   })),
      //   languages: doctor.doctorLanguages.map(dl => ({
      //     code: dl.language.code,
      //     name: dl.language.name,
      //     fluency: dl.fluency
      //   })),
      //   education: doctor.education.map(edu => ({
      //     degree: edu.degree,
      //     institution: edu.institution,
      //     year: edu.year
      //   }))
      // };
      const {
        id,
        name,
        doctor: {
          licenseId,
          bio,
          isVerified,
          city,
          state,
          specializations,
          doctorLanguages,
          education,
        },
      } = doctor;

      const formattedDoctor = {
        id,
        name,
        licenseId,
        bio,
        isVerified,
        city,
        state,
        specializations: specializations.map((sp) => ({
          id: sp.specialization.id,
          name: sp.specialization.name,
          isPrimary: sp.isPrimary,
          consultationFees: sp.consultationFees || "0",
        })),
        languages: doctorLanguages.map((dl) => ({
          code: dl.language.code,
          name: dl.language.name,
          fluency: dl.fluency,
        })),
        education: education.map((edu) => ({
          degree: edu.degree,
          institution: edu.institution,
          year: edu.year,
        })),
      };

      res.json(formattedDoctor);
    } catch (error) {
      console.error("Error fetching doctor:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
// add eduction
router.post(
  "/addeduction",
  authenticateUser,
  authorizeRoles(["doctor"]),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const { degree, institution, year } = req.body;
      const doctor = await prisma.usera.findUnique({
        where: { id: userId },
        include: { doctor: true },
      });

      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      const result = await prisma.education.create({
        data: {
          doctorId: doctor?.doctor?.id,
          degree,
          institution,
          year,
        },
      });

      res.status(201).json({
        message: "Education records added successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error adding education:", error);
      res.status(500).json({
        message: "Failed to add education records",
        error: error.message,
      });
    }
  }
);
import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

client.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  await client.connect();
  console.log("Connected to Redis!");
})();

//serch query
router.get("/serchdoctore", async (req, res) => {
  try {
    const { specialization, languages, city, page = 1, limit = 10 } = req.query;
    console.log("req.queryyy", req.query);

    // Parse numeric values
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Create cache key based on query parameters
    const cacheKey = `doctors:${JSON.stringify({
      specialization,
      languages,
      city,
      page,
      limit,
    })}`;

    // Try to get results from cache first
    const cachedResults = await client.get(cacheKey);
    // if (cachedResults) {
    //   console.log('Cache hit for:', cacheKey);
    //   return res.json(JSON.parse(cachedResults));
    // }

    console.log("Cache miss, querying database...");

    // Convert comma-separated values to arrays
    const languageCodes = languages ? languages.split(",") : [];
    const specializationIds = specialization
      ? specialization.split(",").map(Number)
      : [];

    // Build where clause for the query
    const where = {
      isActive: true,
      // isVerified: true
    };

    // Add city filter if provided
    if (city) {
      where.city = {
        contains: city,
        mode: "insensitive",
      };
    }

    // // Add minimum experience filter if provided
    // if (minExperience) {
    //   where.experience = {
    //     gte: parseInt(minExperience)
    //   };
    // }

    // Add maximum fees filter if provided
    // if (maxFees) {
    //   where.consultationFees = {
    //     lte: parseFloat(maxFees)
    //   };
    // }

    // Add language filter if provided
    if (languageCodes.length > 0) {
      where.doctorLanguages = {
        some: {
          language: {
            code: { in: languageCodes },
          },
        },
      };
    }

    // Add specialization filter if provided
    if (specializationIds.length > 0) {
      where.specializations = {
        some: {
          specializationId: { in: specializationIds },
        },
      };
    }

    // Use Promise.all for parallel execution of queries
    const [doctors, totalCount] = await Promise.all([
      prisma.doctor.findMany({
        where,
        include: {
          // Only include necessary fields to reduce data transfer
          specializations: {
            include: {
              specialization: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          doctorLanguages: {
            include: {
              language: {
                select: {
                  code: true,
                  name: true,
                },
              },
            },
          },
          // Select only needed education fields
          education: {
            select: {
              degree: true,
              institution: true,
              year: true,
            },
          },
        },
        skip,
        take: limitNum,
        orderBy: [{ createdAt: "desc" }],
      }),
      prisma.doctor.count({ where }),
    ]);

    console.log("k---", doctors);

    // Format response data (move this to a separate function for cleaner code)
    const formattedDoctors = doctors.map((doctor) => ({
      id: doctor.id,
      name: doctor.name,
      licenseId: doctor.licenseId,
      bio: doctor.bio,
      consultationFees: doctor.consultationFees,
      experience: doctor.experience,
      experienceDescription: doctor.experienceDescription,
      isVerified: doctor.isVerified,
      city: doctor.city,
      state: doctor.state,
      specializations: doctor.specializations.map((sp) => ({
        id: sp.specialization.id,
        name: sp.specialization.name,
        isPrimary: sp.isPrimary,
      })),
      languages: doctor.doctorLanguages.map((dl) => ({
        code: dl.language.code,
        name: dl.language.name,
        fluency: dl.fluency,
      })),
      education: doctor.education.map((edu) => ({
        degree: edu.degree,
        institution: edu.institution,
        year: edu.year,
      })),
    }));

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);

    // Prepare response
    const response = {
      data: formattedDoctors,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    };

    // Cache results (expire after 10 minutes)
    await client.set(cacheKey, JSON.stringify(response), {
      EX: 600, // 10 minutes
    });

    res.json(response);
  } catch (error) {
    console.error("Error searching doctors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//get all languages
router.get("/languages", async (req, res) => {
  try {
    // Try cache first
    const cacheKey = "languages:all";
    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    // If not in cache, get from database
    const languages = await prisma.language.findMany({
      select: {
        code: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Cache the results
    await client.set(cacheKey, JSON.stringify(languages), {
      EX: 86400, // 24 hours
    });

    res.json(languages);
  } catch (error) {
    console.error("Error fetching languages:", error);
    res.status(500).json({ error: "Failed to fetch languages" });
  }
});

// Get all cities
router.get("/cities", async (req, res) => {
  try {
    // Try cache first
    const cacheKey = "cities:all";
    const cachedData = await client.get(cacheKey);
    console.log("citys", cachedData);

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    // If not in cache, get from database
    const cities = await prisma.city.findMany({
      select: {
        name: true,
        state: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    console.log("vitys", cities);

    // Cache the results
    await client.set(cacheKey, JSON.stringify(cities), {
      EX: 86400, // 24 hours
    });

    res.json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ error: "Failed to fetch cities" });
  }
});

//get all spilaztion
router.get("/specializations", async (req, res) => {
  try {
    // Try cache first
    const cacheKey = "specializations:all";
    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    // If not in cache, get from database
    const specializations = await prisma.specialization.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Cache the results
    await client.set(cacheKey, JSON.stringify(specializations), {
      EX: 86400, // 24 hours
    });

    res.json(specializations);
  } catch (error) {
    console.error("Error fetching specializations:", error);
    res.status(500).json({ error: "Failed to fetch specializations" });
  }
});

//

router.post(
  "/date-schedule",
  authenticateUser,
  authorizeRoles(["doctor"]),
  async (req, res) => {
    // dateSchedules format: [
    //   {
    //     scheduleDate: "2025-03-10", // Format: YYYY-MM-DD
    //     isAvailable: true,
    //     appointmentDuration: 60
    //   },
    //   ...
    // ]

    try {
      const userId = req.user.userId;
      const doctor = await prisma.usera.findUnique({
        where: { id: userId },
        include: { doctor: true },
      });

      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      const { dateSchedules } = req.body;
      // Process each date in the schedule
      console.log("datasedule", dateSchedules);

      const results = [];
      for (const dateSchedule of dateSchedules) {
        const scheduleDate = new Date(dateSchedule.scheduleDate);

        // Validate date format
        if (isNaN(scheduleDate.getTime())) {
          results.push({
            error: `Invalid date format for: ${dateSchedule.scheduleDate}. Use YYYY-MM-DD format.`,
          });
          continue;
        }

        // Upsert (update or insert) schedule for each date
        const schedule = await prisma.dateSchedule.upsert({
          where: {
            doctorId_scheduleDate: {
              doctorId: doctor?.doctor?.id,
              scheduleDate: scheduleDate,
            },
          },
          update: {
            isAvailable: dateSchedule.isAvailable,
            appointmentDuration: dateSchedule.appointmentDuration || null,
          },
          create: {
            doctorId: doctor?.doctor?.id,
            scheduleDate: scheduleDate,
            isAvailable: dateSchedule.isAvailable,
            appointmentDuration: dateSchedule.appointmentDuration || null,
          },
        });

        results.push(schedule);
      }

      res.json({ success: true, schedules: results });
    } catch (error) {
      console.error("Error setting date-based schedule:", error);
      res
        .status(500)
        .json({
          error: "Failed to set date-based schedule",
          details: error.message,
        });
    }
  }
);

router.post(
  "/date-timeslots",
  authenticateUser,
  authorizeRoles(["doctor"]),
  async (req, res) => {
    const { scheduleDate, timeSlots } = req.body;
    // Format:
    // scheduleDate: "2025-03-10" (YYYY-MM-DD)
    // timeSlots: [
    //   { startTime: "09:00", endTime: "10:00" },
    //   { startTime: "10:00", endTime: "11:00" },
    //   ...
    // ]

    try {
      const userId = req.user.userId;
      const doctor = await prisma.usera.findUnique({
        where: { id: userId },
        include: { doctor: true },
      });

      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      const dateObj = new Date(scheduleDate);

      // Validate date format
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({
          error: `Invalid date format: ${scheduleDate}. Use YYYY-MM-DD format.`,
        });
      }

      // Get the schedule for the specified date
      const schedule = await prisma.dateSchedule.findUnique({
        where: {
          doctorId_scheduleDate: {
            doctorId: doctor?.doctor?.id,
            scheduleDate: dateObj,
          },
        },
      });

      if (!schedule) {
        return res.status(404).json({
          error: `Schedule for ${scheduleDate} not found. Please set date availability first.`,
        });
      }

      if (!schedule.isAvailable) {
        return res.status(400).json({
          error: `Doctor is not available on ${scheduleDate}. Please update availability first.`,
        });
      }

      // Create time slots
      const createdSlots = [];
      for (const slot of timeSlots) {
        // Check if slot already exists
        const existingSlot = await prisma.dateTimeSlot.findFirst({
          where: {
            dateScheduleId: schedule.id,
            startTime: slot.startTime,
            endTime: slot.endTime,
          },
        });

        if (!existingSlot) {
          const newSlot = await prisma.dateTimeSlot.create({
            data: {
              dateScheduleId: schedule.id,
              startTime: slot.startTime,
              endTime: slot.endTime,
              isBooked: false,
            },
          });
          createdSlots.push(newSlot);
        } else {
          createdSlots.push(existingSlot);
        }
      }

      res.json({ success: true, timeSlots: createdSlots });
    } catch (error) {
      console.error("Error setting date time slots:", error);
      res
        .status(500)
        .json({
          error: "Failed to set date time slots",
          details: error.message,
        });
    }
  }
);

//avlible time slot
router.post("/available-date-slots", async (req, res) => {
  // const { doctorId } = req.params;
  const { startDate, endDate, doctorId } = req.body;
  console.log("res", req.body);

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "Both startDate and endDate are required" });
  }

  try {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Validate date format
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return res.status(400).json({
        error: "Invalid date format. Use YYYY-MM-DD format.",
      });
    }

    // Get all available schedules for the doctor within the date range
    const dateSchedules = await prisma.dateSchedule.findMany({
      where: {
        doctorId: doctorId,
        isAvailable: true,
        scheduleDate: {
          gte: startDateObj,
          lte: endDateObj,
        },
      },
      include: {
        dateTimeSlots: {
          where: {
            isBooked: false,
          },
        },
      },
    });

    // Format the response
    const availableDateSlots = dateSchedules.map((schedule) => {
      // Format date as YYYY-MM-DD
      const formattedDate = schedule.scheduleDate.toISOString().split("T")[0];

      return {
        scheduleId: schedule.id,
        date: formattedDate,
        appointmentDuration: schedule.appointmentDuration,
        availableSlots: schedule.dateTimeSlots.map((slot) => ({
          id: slot.id,
          startTime: slot.startTime,
          endTime: slot.endTime,
        })),
      };
    });

    // Sort by date
    availableDateSlots.sort((a, b) => a.date.localeCompare(b.date));

    res.json(availableDateSlots);
  } catch (error) {
    console.error("Error getting available date slots:", error);
    res
      .status(500)
      .json({
        error: "Failed to get available date slots",
        details: error.message,
      });
  }
});

//book apoinment

router.post("/book-appointments", async (req, res) => {
  const { doctorId, patientId, dateTimeSlotId, notes } = req.body;

  try {
    // Check if the time slot exists and is not booked
    const timeSlot = await prisma.dateTimeSlot.findUnique({
      where: {
        id: dateTimeSlotId,
      },
      include: {
        dateSchedule: true,
      },
    });

    if (!timeSlot) {
      return res.status(404).json({ error: "Time slot not found" });
    }

    if (timeSlot.isBooked) {
      return res
        .status(400)
        .json({ error: "This time slot is already booked" });
    }

    // Extract the date from the schedule and combine with the time slot
    const appointmentDate = new Date(timeSlot.dateSchedule.scheduleDate);
    const [hours, minutes] = timeSlot.startTime.split(":").map(Number);
    appointmentDate.setHours(hours, minutes, 0, 0);

    // Start a transaction to book the slot and create the appointment
    const appointment = await prisma.$transaction(async (prisma) => {
      // Mark the slot as booked
      await prisma.dateTimeSlot.update({
        where: { id: dateTimeSlotId },
        data: { isBooked: true },
      });

      // Create the appointment
      return prisma.appointment.create({
        data: {
          doctorId,
          patientId,
          dateTimeSlotId,
          appointmentDate,
          notes,
          status: "SCHEDULED",
        },
      });
    });

    res.json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error booking date appointment:", error);
    res
      .status(500)
      .json({ error: "Failed to book appointment", details: error.message });
  }
});

router.get("/api/doctors/:doctorId/date-appointments", async (req, res) => {
  const { doctorId } = req.params;
  const { startDate, endDate, status } = req.query; // Optional filters

  try {
    const where = { doctorId };

    // Add date range filter if provided
    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      if (!isNaN(startDateObj.getTime()) && !isNaN(endDateObj.getTime())) {
        where.appointmentDate = {
          gte: startDateObj,
          lte: endDateObj,
        };
      }
    }

    // Add status filter if provided
    if (status) {
      where.status = status;
    }

    // Get all date-based appointments
    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          include: {
            usera: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        dateTimeSlot: {
          include: {
            dateSchedule: true,
          },
        },
      },
      orderBy: [
        {
          appointmentDate: "asc",
        },
      ],
    });

    // Filter to include only date-based appointments (with dateTimeSlotId)
    const dateAppointments = appointments.filter((apt) => apt.dateTimeSlotId);

    // Format appointments for easier front-end use
    const formattedAppointments = dateAppointments.map((apt) => ({
      id: apt.id,
      doctorId: apt.doctorId,
      patient: {
        id: apt.patient.id,
        name: apt.patient.usera.name,
        email: apt.patient.usera.email,
        phone: apt.patient.usera.phone,
        medicalHistory: apt.patient.medicalHistory,
      },
      date: apt.appointmentDate.toISOString().split("T")[0],
      startTime: apt.dateTimeSlot.startTime,
      endTime: apt.dateTimeSlot.endTime,
      duration: apt.dateTimeSlot.dateSchedule.appointmentDuration,
      status: apt.status,
      notes: apt.notes,
      createdAt: apt.createdAt,
    }));

    res.json(formattedAppointments);
  } catch (error) {
    console.error("Error getting doctor date appointments:", error);
    res
      .status(500)
      .json({ error: "Failed to get appointments", details: error.message });
  }
});

export default router;

// router.post("/register", authenticateUser,authorizeRoles(["doctor"]),async (req, res) => {
//      try {
//        const {
//          name,
//          licenseId,
//          bio,
//          consultationFees,
//          experience,
//          experienceDescription,
//          city,
//          state,
//          treatments,
//          workingDays
//        } = req.body;
//        const userId = req.user.userId;

//        const existingDoctor = await prisma.doctor.findFirst({
//         where: {
//           OR: [
//             { useraId: userId },
//             { licenseId: licenseId }
//           ],
//         },
//       });
//       if (existingDoctor) {
//         return res.status(400).json({ success: false, message: "License ID already exists. Use a unique License ID. or doctore are already register" });
//       }
//        // Create doctor
//        const doctor = await prisma.doctor.create({
//          data: {
//            name,
//            licenseId,
//            bio,
//            consultationFees: parseFloat(consultationFees),
//            experience: parseInt(experience),
//            experienceDescription,
//            city,
//            state,
//            treatments: treatments || [],
//            workingDays: workingDays || [],
//            usera: {
//             connect: { id: userId },
//           },
//          }
//        });

//        res.status(201).json(doctor);
//      } catch (error) {

//        console.error('Error creating doctor:', error);
//        res.status(500).json({ error: 'Internal server error' });
//      }
//    });
