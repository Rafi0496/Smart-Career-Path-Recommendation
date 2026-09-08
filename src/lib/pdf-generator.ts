import { jsPDF } from "jspdf";
import type { CareerRecommendation } from "./types";

/**
 * Generates a styled, multi-page PDF document for any Career Roadmap.
 * Works uniformly in both Node.js (Next.js server API) and browser environments.
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

  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 18) {
      doc.addPage();
      currentY = 18;
      drawPageHeaderMini();
    }
  };

  const drawPageHeaderMini = () => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`Smart Career Path AI — ${career.careerTitle} Roadmap`, margin, 10);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, 12, pageWidth - margin, 12);
  };

  // =========================================================================
  // Top Header Banner
  // =========================================================================
  doc.setFillColor(15, 23, 42); // slate-900 dark theme bar
  doc.roundedRect(margin, currentY, contentWidth, 34, 4, 4, "F");

  // Accent badge
  doc.setFillColor(14, 165, 233); // sky-500
  doc.roundedRect(margin + 6, currentY + 6, 42, 5.5, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("AI CAREER ROADMAP", margin + 8.5, currentY + 9.8);

  // Career Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  const titleText = career.careerTitle || "Career Roadmap";
  doc.text(titleText, margin + 6, currentY + 20);

  // Prepared For & Date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  doc.text(`Prepared for: ${userName || "Candidate"}  •  Generated: ${dateStr}`, margin + 6, currentY + 28);

  currentY += 40;

  // =========================================================================
  // Executive Overview Metrics Box
  // =========================================================================
  const cardWidth = (contentWidth - 6) / 3;
  const cardHeight = 18;

  // Card 1: Match Score
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, cardWidth, cardHeight, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("AI MATCH SCORE", margin + 4, currentY + 6);
  doc.setFontSize(12);
  doc.setTextColor(14, 165, 233); // sky-500
  doc.text(`${career.matchScore || 90}% Match`, margin + 4, currentY + 13.5);

  // Card 2: Timeline
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin + cardWidth + 3, currentY, cardWidth, cardHeight, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("ESTIMATED TIMELINE", margin + cardWidth + 7, currentY + 6);
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  const timelineText = career.estimatedTimeline || "6–12 Months";
  doc.text(doc.splitTextToSize(timelineText, cardWidth - 8)[0] || timelineText, margin + cardWidth + 7, currentY + 13);

  // Card 3: Salary Range
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin + (cardWidth + 3) * 2, currentY, cardWidth, cardHeight, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("SALARY RANGE", margin + (cardWidth + 3) * 2 + 4, currentY + 6);
  doc.setFontSize(9.5);
  doc.setTextColor(16, 185, 129); // emerald-600
  const salaryText = career.salaryRange || "Competitive Industry Pay";
  doc.text(doc.splitTextToSize(salaryText, cardWidth - 8)[0] || salaryText, margin + (cardWidth + 3) * 2 + 4, currentY + 13);

  currentY += cardHeight + 6;

  // =========================================================================
  // Core Summary & Overview
  // =========================================================================
  if (career.description || career.simpleSummary) {
    checkPageBreak(25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Overview & Core Summary", margin, currentY);
    currentY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const summary = career.simpleSummary || career.description;
    const splitSummary = doc.splitTextToSize(summary, contentWidth);
    doc.text(splitSummary, margin, currentY);
    currentY += splitSummary.length * 4.5 + 4;
  }

  // =========================================================================
  // Required Skills & Competencies
  // =========================================================================
  if (career.requiredSkills && career.requiredSkills.length > 0) {
    checkPageBreak(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Required Skills & Competencies", margin, currentY);
    currentY += 5;

    const skillsText = career.requiredSkills.join("  •  ");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    const splitSkills = doc.splitTextToSize(skillsText, contentWidth);
    doc.text(splitSkills, margin, currentY);
    currentY += splitSkills.length * 4.5 + 4;
  }

  // =========================================================================
  // Why This Fits You
  // =========================================================================
  if (career.whyRecommended && career.whyRecommended.length > 0) {
    checkPageBreak(25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Why This Path Fits You", margin, currentY);
    currentY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);

    for (const point of career.whyRecommended.slice(0, 4)) {
      checkPageBreak(8);
      const splitPoint = doc.splitTextToSize(`✓  ${point}`, contentWidth - 4);
      doc.text(splitPoint, margin + 2, currentY);
      currentY += splitPoint.length * 4.2;
    }
    currentY += 4;
  }

  // =========================================================================
  // Sequential Learning Path
  // =========================================================================
  if (career.learningPath && career.learningPath.length > 0) {
    checkPageBreak(18);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 6;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("Sequential Learning Roadmap", margin, currentY);
    currentY += 6;

    career.learningPath.forEach((step, idx) => {
      const stepOrder = step.order || idx + 1;
      const stepTitle = step.title || `Stage ${stepOrder}`;
      const stepDuration = step.duration ? `(${step.duration})` : "";
      const stepDesc = step.description || "";

      // Estimate height needed for this stage
      checkPageBreak(32);

      // Stage Header Pill
      doc.setFillColor(241, 245, 249); // slate-100
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin, currentY, contentWidth, 7, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(14, 165, 233);
      doc.text(`STAGE ${stepOrder}`, margin + 3, currentY + 4.8);

      doc.setTextColor(15, 23, 42);
      doc.text(`: ${stepTitle}  ${stepDuration}`, margin + 20, currentY + 4.8);
      currentY += 9;

      // Description
      if (stepDesc) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        const splitDesc = doc.splitTextToSize(stepDesc, contentWidth - 4);
        doc.text(splitDesc, margin + 4, currentY);
        currentY += splitDesc.length * 4 + 1.5;
      }

      // Action Procedure Steps
      if (step.procedure && step.procedure.length > 0) {
        step.procedure.slice(0, 3).forEach((proc, pIdx) => {
          checkPageBreak(7);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(51, 65, 85);
          const splitProc = doc.splitTextToSize(`${pIdx + 1}. ${proc}`, contentWidth - 8);
          doc.text(splitProc, margin + 6, currentY);
          currentY += splitProc.length * 3.8;
        });
        currentY += 1.5;
      }

      // Resources
      if (step.resources && step.resources.length > 0) {
        checkPageBreak(6);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text("Resources:", margin + 6, currentY);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(14, 165, 233);
        const resLine = step.resources.slice(0, 3).join(", ");
        const splitRes = doc.splitTextToSize(resLine, contentWidth - 28);
        doc.text(splitRes, margin + 22, currentY);
        currentY += splitRes.length * 3.8 + 2;
      }

      currentY += 2;
    });
  }

  // =========================================================================
  // Page Numbers Footer
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
      "Smart Career Path AI Recommendation Platform • https://smart-career-path.vercel.app",
      margin,
      pageHeight - 7
    );
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin - 18, pageHeight - 7);
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
 * Triggers direct client-side browser download of the PDF roadmap.
 */
export function downloadCareerPdfInBrowser(career: CareerRecommendation, userName: string = "Candidate"): void {
  const doc = buildCareerPdf(career, userName);
  const slug = (career.careerTitle || "Career_Roadmap").replace(/[^a-zA-Z0-9_\-]+/g, "_");
  doc.save(`${slug}_Roadmap.pdf`);
}
