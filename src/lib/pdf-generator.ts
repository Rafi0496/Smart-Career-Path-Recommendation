import { jsPDF } from "jspdf";
import type { CareerRecommendation } from "./types";

/**
 * Strips or converts non-ASCII characters to standard ASCII to prevent
 * encoding errors in jsPDF with standard Helvetica WinAnsi font.
 */
function cleanText(input?: string): string {
  if (!input) return "";
  return input
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, "-")
    .replace(/[\u2713\u2714\u221A]/g, "+")
    .replace(/[^\x20-\x7E\n\r\t]/g, "")
    .trim();
}

/**
 * Generates a comprehensive, styled, multi-page PDF document for any Career Roadmap.
 * Contains complete career intelligence, action procedures, learning steps, resources,
 * and milestone guidance.
 */
export function buildCareerPdf(career: CareerRecommendation, userName: string = "Candidate"): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let currentY = 16;

  const drawPageHeaderMini = () => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`Smart Career Path AI - ${cleanText(career.careerTitle)} Comprehensive Roadmap`, margin, 10);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, 12, pageWidth - margin, 12);
  };

  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 20) {
      doc.addPage();
      currentY = 18;
      drawPageHeaderMini();
    }
  };

  // =========================================================================
  // Top Header Banner
  // =========================================================================
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, currentY, contentWidth, 36, 4, 4, "F");

  // Accent badge
  doc.setFillColor(14, 165, 233); // sky-500
  doc.roundedRect(margin + 6, currentY + 6, 46, 5.5, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("AI CAREER BLUEPRINT", margin + 8, currentY + 9.8);

  // Career Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  const titleText = cleanText(career.careerTitle) || "Career Roadmap";
  doc.text(titleText, margin + 6, currentY + 21);

  // Candidate name & generation date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225); // slate-300
  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const candidateName = cleanText(userName) || "Candidate";
  doc.text(`Prepared for: ${candidateName}   |   Issued: ${dateStr}   |   Source: Smart Career Path AI`, margin + 6, currentY + 30);

  currentY += 42;

  // =========================================================================
  // Executive Overview KPI Metrics Grid
  // =========================================================================
  const cardWidth = (contentWidth - 9) / 4;
  const cardHeight = 18;

  // Metric 1: Match Score
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, cardWidth, cardHeight, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("AI MATCH SCORE", margin + 3.5, currentY + 5.5);
  doc.setFontSize(11);
  doc.setTextColor(14, 165, 233); // sky-500
  doc.text(`${career.matchScore || 90}% Match`, margin + 3.5, currentY + 13);

  // Metric 2: Skill Overlap
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin + cardWidth + 3, currentY, cardWidth, cardHeight, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("SKILL OVERLAP", margin + cardWidth + 6.5, currentY + 5.5);
  doc.setFontSize(11);
  doc.setTextColor(16, 185, 129); // emerald-500
  const overlapVal = career.skillOverlapPercent !== undefined ? career.skillOverlapPercent : Math.min(95, Math.max(50, Math.round(career.matchScore * 0.85)));
  doc.text(`${overlapVal}% Aligned`, margin + cardWidth + 6.5, currentY + 13);

  // Metric 3: Timeline
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin + (cardWidth + 3) * 2, currentY, cardWidth, cardHeight, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("TARGET TIMELINE", margin + (cardWidth + 3) * 2 + 3.5, currentY + 5.5);
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  const timelineText = cleanText(career.estimatedTimeline) || "6-12 Months";
  const splitTimeline = doc.splitTextToSize(timelineText, cardWidth - 6);
  doc.text(splitTimeline[0] || timelineText, margin + (cardWidth + 3) * 2 + 3.5, currentY + 13);

  // Metric 4: Salary Potential
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin + (cardWidth + 3) * 3, currentY, cardWidth, cardHeight, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("SALARY OUTLOOK", margin + (cardWidth + 3) * 3 + 3.5, currentY + 5.5);
  doc.setFontSize(8.5);
  doc.setTextColor(99, 102, 241); // indigo-500
  const salaryText = cleanText(career.salaryRange) || "$60k - $120k / yr";
  const splitSalary = doc.splitTextToSize(salaryText, cardWidth - 6);
  doc.text(splitSalary[0] || salaryText, margin + (cardWidth + 3) * 3 + 3.5, currentY + 13);

  currentY += cardHeight + 7;

  // =========================================================================
  // Section: Executive Overview & Summary
  // =========================================================================
  if (career.description || career.simpleSummary) {
    checkPageBreak(25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Executive Summary & Role Profile", margin, currentY);
    currentY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const summary = cleanText(career.simpleSummary ? `${career.simpleSummary} ${career.description}` : career.description);
    const splitSummary = doc.splitTextToSize(summary, contentWidth);
    doc.text(splitSummary, margin, currentY);
    currentY += splitSummary.length * 4.2 + 5;
  }

  // =========================================================================
  // Section: Skill Gap Analysis (Matching Skills vs Skills to Develop)
  // =========================================================================
  const hasMatching = career.matchingSkills && career.matchingSkills.length > 0;
  const hasToDevelop = career.skillsToDevelop && career.skillsToDevelop.length > 0;
  const hasRequired = career.requiredSkills && career.requiredSkills.length > 0;

  if (hasMatching || hasToDevelop || hasRequired) {
    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Skills Intelligence & Gap Analysis", margin, currentY);
    currentY += 5;

    const colWidth = (contentWidth - 4) / 2;

    // Left Column: Possessed / Matching Skills
    doc.setFillColor(240, 253, 244); // emerald-50
    doc.setDrawColor(187, 247, 208);
    const skillsPossessed = hasMatching ? career.matchingSkills! : (career.requiredSkills || []).slice(0, 3);
    const leftHeight = Math.max(22, 12 + skillsPossessed.length * 4.2);
    doc.roundedRect(margin, currentY, colWidth, leftHeight, 2.5, 2.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(21, 128, 61); // emerald-700
    doc.text("Current Strengths & Matching Skills", margin + 3.5, currentY + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    skillsPossessed.forEach((s, idx) => {
      doc.setFillColor(34, 197, 94);
      doc.circle(margin + 5, currentY + 10 + idx * 4.2, 0.9, "F");
      doc.text(cleanText(s), margin + 8, currentY + 11 + idx * 4.2);
    });

    // Right Column: Target Skills to Develop
    doc.setFillColor(238, 242, 255); // indigo-50
    doc.setDrawColor(199, 210, 254);
    const skillsTarget = hasToDevelop ? career.skillsToDevelop! : (career.requiredSkills || []).slice(3, 8);
    const rightHeight = Math.max(22, 12 + skillsTarget.length * 4.2);
    doc.roundedRect(margin + colWidth + 4, currentY, colWidth, Math.max(leftHeight, rightHeight), 2.5, 2.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(67, 56, 202); // indigo-700
    doc.text("Key Target Skills to Develop", margin + colWidth + 7.5, currentY + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    skillsTarget.forEach((s, idx) => {
      doc.setFillColor(99, 102, 241);
      doc.circle(margin + colWidth + 9, currentY + 10 + idx * 4.2, 0.9, "F");
      doc.text(cleanText(s), margin + colWidth + 12, currentY + 11 + idx * 4.2);
    });

    currentY += Math.max(leftHeight, rightHeight) + 6;
  }

  // =========================================================================
  // Section: Why This Career Path Fits You
  // =========================================================================
  if (career.whyRecommended && career.whyRecommended.length > 0) {
    checkPageBreak(25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Personal Fit & Recommendation Rationale", margin, currentY);
    currentY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);

    career.whyRecommended.forEach((reason) => {
      checkPageBreak(9);
      doc.setFillColor(14, 165, 233);
      doc.circle(margin + 2.5, currentY + 1.2, 1.1, "F");
      const splitReason = doc.splitTextToSize(cleanText(reason), contentWidth - 8);
      doc.text(splitReason, margin + 6, currentY + 2);
      currentY += splitReason.length * 4.2 + 1.5;
    });

    currentY += 4;
  }

  // =========================================================================
  // Section: Instructions & Action Protocol for Success
  // =========================================================================
  checkPageBreak(38);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 32, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Action Protocol: How to Execute This Roadmap", margin + 4, currentY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  const instructions = [
    "1. Consistency First: Commit 8 to 12 hours weekly to complete each sequential stage.",
    "2. Hands-on Practice: Build 2-3 real-world portfolio projects demonstrating core competencies.",
    "3. Community & Mentorship: Engage with professional communities (GitHub, LinkedIn, Discord).",
    "4. Skill Validation: Test your mastery using the in-app Skill Quizzes for every stage."
  ];

  instructions.forEach((inst, i) => {
    doc.text(inst, margin + 4, currentY + 12 + i * 4.5);
  });

  currentY += 38;

  // =========================================================================
  // Section: Complete Sequential Learning Roadmap
  // =========================================================================
  if (career.learningPath && career.learningPath.length > 0) {
    checkPageBreak(18);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 6;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Sequential Learning Roadmap & Execution Stages", margin, currentY);
    currentY += 6;

    career.learningPath.forEach((step, idx) => {
      const stepOrder = step.order || idx + 1;
      const stepTitle = cleanText(step.title) || `Stage ${stepOrder}`;
      const stepDuration = step.duration ? cleanText(`(${step.duration})`) : "";
      const stepDesc = cleanText(step.description);

      // Stage Box Header
      checkPageBreak(35);

      doc.setFillColor(241, 245, 249); // slate-100
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin, currentY, contentWidth, 7.5, 2, 2, "FD");

      // Number badge
      doc.setFillColor(14, 165, 233); // sky-500
      doc.roundedRect(margin + 2, currentY + 1.2, 17, 5, 1.5, 1.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(`STAGE ${stepOrder}`, margin + 3.5, currentY + 4.8);

      // Title & Duration
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${stepTitle}  ${stepDuration}`, margin + 22, currentY + 4.8);
      currentY += 10;

      // Description
      if (stepDesc) {
        checkPageBreak(12);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        const splitDesc = doc.splitTextToSize(stepDesc, contentWidth - 4);
        doc.text(splitDesc, margin + 3, currentY);
        currentY += splitDesc.length * 4.2 + 2;
      }

      // Step-by-Step Action Procedures (ALL OF THEM)
      if (step.procedure && step.procedure.length > 0) {
        checkPageBreak(12);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);
        doc.text("Action Steps & Practical Exercises:", margin + 3, currentY);
        currentY += 4.5;

        step.procedure.forEach((proc, pIdx) => {
          checkPageBreak(8);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(51, 65, 85);
          const cleanProc = cleanText(proc);
          const splitProc = doc.splitTextToSize(`${pIdx + 1}. ${cleanProc}`, contentWidth - 8);
          doc.text(splitProc, margin + 5, currentY);
          currentY += splitProc.length * 3.8 + 1;
        });
        currentY += 2;
      }

      // Recommended Learning Resources (ALL OF THEM)
      if (step.resources && step.resources.length > 0) {
        checkPageBreak(10);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("Curated Resources:", margin + 3, currentY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(14, 165, 233); // sky-500
        const cleanResList = step.resources.map((r) => cleanText(r)).join("   |   ");
        const splitRes = doc.splitTextToSize(cleanResList, contentWidth - 32);
        doc.text(splitRes, margin + 32, currentY);
        currentY += splitRes.length * 3.8 + 4;
      } else {
        currentY += 3;
      }
    });
  }

  // =========================================================================
  // Page Numbers and Footer
  // =========================================================================
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.text(
      "Smart Career Path AI Platform - Personalized Career Intelligence & Roadmap",
      margin,
      pageHeight - 7
    );
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 7);
  }

  return doc;
}

/**
 * Generates an ArrayBuffer representation of the PDF for server responses.
 */
export function buildCareerPdfArrayBuffer(career: CareerRecommendation, userName: string = "Candidate"): ArrayBuffer {
  const doc = buildCareerPdf(career, userName);
  return doc.output("arraybuffer");
}

/**
 * Triggers direct client-side browser download of the PDF roadmap with a robust Blob URL.
 */
export function downloadCareerPdfInBrowser(career: CareerRecommendation, userName: string = "Candidate"): void {
  const doc = buildCareerPdf(career, userName);
  const rawSlug = (career.careerTitle || "Career_Roadmap").replace(/[^a-zA-Z0-9_\-]+/g, "_");
  const filename = `${rawSlug}_Roadmap.pdf`;

  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.style.display = "none";
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();

  // Revoke after 60 seconds so Chrome or any browser has ample time to complete the download
  setTimeout(() => {
    try {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch {}
  }, 60000);
}

/**
 * Opens the PDF directly in a new browser tab for immediate viewing and printing.
 */
export function openCareerPdfInBrowser(career: CareerRecommendation, userName: string = "Candidate"): void {
  const doc = buildCareerPdf(career, userName);
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}
