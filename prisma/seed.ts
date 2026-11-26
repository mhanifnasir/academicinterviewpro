import { PrismaClient } from "@prisma/client";
import { HEC_SUBJECTS_2025, INITIAL_QUESTION_BANK } from "../src/data/hec-curriculum-2025";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Academic Interview Pro database seed (HEC 2025 Curriculum & Question Bank)...");

  // 1. Seed System Roles
  const roles = [
    { name: "candidate", description: "Computer Science Lecturer job applicant in Pakistan" },
    { name: "admin", description: "Platform administrator with full curriculum and user oversight" },
    { name: "reviewer", description: "Subject specialist reviewing past papers and viva questions" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
  }
  console.log("✅ Seeded system roles (candidate, admin, reviewer)");

  // 2. Seed Subscription Plans in PKR
  const plans = [
    {
      code: "FREE",
      name: "Aspirant Free",
      pricePKR: 0,
      billingInterval: "LIFETIME",
      featuresJson: [
        "20 MCQs practice daily",
        "1 AI Viva Voce simulation / month",
        "Syllabus breakdown for PPSC & FPSC",
        "Core formulas & cheat sheets",
      ],
      isActive: true,
    },
    {
      code: "LECTURER_PRO",
      name: "Lecturer Pro",
      pricePKR: 2499,
      billingInterval: "MONTHLY",
      featuresJson: [
        "Unlimited topic-wise MCQ practice",
        "15 Full-length 100-mark mock examinations",
        "12 Virtual 3-Member Board Viva sessions",
        "Micro-teaching classroom evaluation",
        "English spoken fluency & filler detector",
        "Past papers (2015-2025) with detailed solutions",
      ],
      isActive: true,
    },
    {
      code: "COMMISSION_MASTER",
      name: "Commission Master",
      pricePKR: 5999,
      billingInterval: "SEASONAL",
      featuresJson: [
        "Everything in Lecturer Pro included",
        "Unlimited 3-Member Board AI Viva simulations",
        "Negative marking calibration engine",
        "Thesis defense & viva cross-examination module",
        "1-on-1 virtual mock interview with appointed lecturers",
      ],
      isActive: true,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { code: plan.code },
      update: {
        name: plan.name,
        pricePKR: plan.pricePKR,
        billingInterval: plan.billingInterval,
        featuresJson: plan.featuresJson,
        isActive: plan.isActive,
      },
      create: plan,
    });
  }
  console.log("✅ Seeded subscription plans (Free, Lecturer Pro, Commission Master in PKR)");

  // 3. Seed Curriculum Versions
  const curriculumVersions = [
    { code: "HEC-2025", title: "HEC Pakistan Revised Computer Science Curriculum 2025", commission: "HEC", year: 2025 },
    { code: "PPSC-2026", title: "Punjab Higher Education Department CS Lecturer Scheme", commission: "PPSC", year: 2026 },
    { code: "FPSC-2026", title: "Federal Government Colleges CS Lecturer Scheme (F.4)", commission: "FPSC", year: 2026 },
    { code: "SPSC-2026", title: "Sindh Public Service Commission CS Lecturer Scheme", commission: "SPSC", year: 2026 },
    { code: "KPPSC-2026", title: "Khyber Pakhtunkhwa PSC CS Lecturer Scheme", commission: "KPPSC", year: 2026 },
    { code: "BPSC-2026", title: "Balochistan Public Service Commission CS Lecturer Scheme", commission: "BPSC", year: 2026 },
  ];

  const cvMap: Record<string, string> = {};
  for (const cv of curriculumVersions) {
    const created = await prisma.curriculumVersion.upsert({
      where: { code: cv.code },
      update: { title: cv.title, commission: cv.commission, year: cv.year },
      create: cv,
    });
    cvMap[cv.code] = created.id;
  }
  console.log("✅ Seeded curriculum versions (HEC-2025, PPSC-2026, FPSC-2026, SPSC, KPPSC, BPSC)");

  // 4. Seed All 21 Subjects and Topics (18 Core CS + 3 Supplementary)
  const subjectRecordMap: Record<string, string> = {};
  const topicRecordMap: Record<string, string> = {};

  for (const s of HEC_SUBJECTS_2025) {
    const subject = await prisma.subject.upsert({
      where: { slug: s.slug },
      update: {
        code: s.code,
        title: s.title,
        category: s.category,
        weightage: s.weightage,
        frequency: s.frequency,
        iconName: s.iconName,
        description: s.description,
        recommendedBooks: s.recommendedBooks,
        displayOrder: s.displayOrder,
      },
      create: {
        slug: s.slug,
        code: s.code,
        title: s.title,
        category: s.category,
        weightage: s.weightage,
        frequency: s.frequency,
        iconName: s.iconName,
        description: s.description,
        recommendedBooks: s.recommendedBooks,
        displayOrder: s.displayOrder,
      },
    });

    subjectRecordMap[s.slug] = subject.id;

    // Create HEC-2025 curriculum mapping for this subject
    if (cvMap["HEC-2025"]) {
      const weightNum = parseFloat(s.weightage.split("-")[0]) || 10;
      await prisma.curriculumMapping.create({
        data: {
          curriculumVersionId: cvMap["HEC-2025"],
          subjectId: subject.id,
          weightagePercentage: weightNum,
          marksAllotted: Math.round(weightNum),
        },
      }).catch(() => {
        // Ignore if already mapped
      });
    }

    for (const t of s.topics) {
      const topic = await prisma.topic.upsert({
        where: {
          subjectId_slug: {
            subjectId: subject.id,
            slug: t.slug,
          },
        },
        update: {
          name: t.name,
          description: t.description,
          difficulty: t.difficulty,
          displayOrder: t.displayOrder,
        },
        create: {
          subjectId: subject.id,
          name: t.name,
          slug: t.slug,
          description: t.description,
          difficulty: t.difficulty,
          displayOrder: t.displayOrder,
        },
      });

      topicRecordMap[`${s.slug}:${t.slug}`] = topic.id;
    }
  }
  console.log(`✅ Seeded all 21 HEC 2025 Subjects and their subtopics`);

  // 5. Seed Comprehensive Question Bank
  for (const q of INITIAL_QUESTION_BANK) {
    const subjectId = subjectRecordMap[q.subjectSlug];
    if (!subjectId) continue;

    const topicId = q.topicSlug ? topicRecordMap[`${q.subjectSlug}:${q.topicSlug}`] : null;

    // Create/upsert question
    const existingQ = await prisma.question.findUnique({
      where: { id: q.id },
    });

    let questionId = q.id;

    if (!existingQ) {
      const createdQ = await prisma.question.create({
        data: {
          id: q.id,
          subjectId,
          topicId: topicId || null,
          statement: q.statement,
          type: q.type,
          difficulty: q.difficulty,
          origin: q.origin,
          status: q.status,
        },
      });
      questionId = createdQ.id;
    } else {
      await prisma.question.update({
        where: { id: q.id },
        data: {
          subjectId,
          topicId: topicId || null,
          statement: q.statement,
          type: q.type,
          difficulty: q.difficulty,
          origin: q.origin,
          status: q.status,
        },
      });
    }

    // Seed Options if MCQ
    if (q.options && q.options.length > 0) {
      for (const opt of q.options) {
        await prisma.questionOption.upsert({
          where: {
            questionId_optionKey: {
              questionId,
              optionKey: opt.optionKey,
            },
          },
          update: {
            statement: opt.statement,
            isCorrect: opt.isCorrect,
          },
          create: {
            questionId,
            optionKey: opt.optionKey,
            statement: opt.statement,
            isCorrect: opt.isCorrect,
          },
        });
      }
    }

    // Seed Answer & Explanation
    await prisma.questionAnswer.upsert({
      where: { questionId },
      update: {
        detailedExplanation: q.detailedExplanation,
        keyPoints: q.keyPoints || [],
        referenceCitation: q.referenceCitation || null,
      },
      create: {
        questionId,
        detailedExplanation: q.detailedExplanation,
        keyPoints: q.keyPoints || [],
        referenceCitation: q.referenceCitation || null,
      },
    });

    // Seed Question Source
    if (q.source) {
      const existingSource = await prisma.questionSource.findFirst({
        where: { questionId },
      });

      if (!existingSource) {
        await prisma.questionSource.create({
          data: {
            questionId,
            sourceName: q.source.sourceName,
            examYear: q.source.examYear || null,
            postTitle: q.source.postTitle || null,
            bookTitle: q.source.bookTitle || null,
          },
        });
      }
    }
  }
  console.log(`✅ Seeded verified past paper questions & explanations with textbook citations`);

  // 6. Seed Test Templates
  const templates = [
    {
      slug: "ppsc-cs-mock-standard",
      title: "PPSC CS Lecturer Full-Length 100-Mark Mock",
      commission: "PPSC",
      durationMinutes: 90,
      totalMarks: 100,
      negativeMarkingRate: 0.25,
      isActive: true,
    },
    {
      slug: "fpsc-cs-mock-standard",
      title: "FPSC Federal CS Lecturer (F.4) Mock Test",
      commission: "FPSC",
      durationMinutes: 100,
      totalMarks: 100,
      negativeMarkingRate: 0.0,
      isActive: true,
    },
    {
      slug: "spsc-cs-mock-standard",
      title: "SPSC Sindh CS Lecturer Screening Test",
      commission: "SPSC",
      durationMinutes: 90,
      totalMarks: 100,
      negativeMarkingRate: 0.25,
      isActive: true,
    },
    {
      slug: "kppsc-cs-mock-standard",
      title: "KPPSC Khyber Pakhtunkhwa CS Lecturer Test",
      commission: "KPPSC",
      durationMinutes: 90,
      totalMarks: 100,
      negativeMarkingRate: 0.25,
      isActive: true,
    },
  ];

  for (const tmpl of templates) {
    await prisma.testTemplate.upsert({
      where: { slug: tmpl.slug },
      update: tmpl,
      create: tmpl,
    });
  }
  console.log("✅ Seeded commission mock test templates (PPSC, FPSC, SPSC, KPPSC)");

  console.log("🚀 Academic Content and Curriculum Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
