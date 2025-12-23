import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDFBlob = async (element) => {
  if (!element) throw new Error("Element not found");

  // Clone node
  const clone = element.cloneNode(true);

  // Wrapper (offscreen but rendered)
  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.left = "-9999px";
  wrapper.style.top = "0";
  wrapper.style.width = "800px";
  wrapper.style.background = "#ffffff";
  wrapper.style.visibility = "visible";

  // 🔥 CRITICAL: remove transforms
  clone.style.transform = "none";
  clone.style.width = "800px";

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  // Wait for layout + fonts
  await new Promise((r) => setTimeout(r, 600));

  const canvas = await html2canvas(wrapper, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  document.body.removeChild(wrapper);

  if (!canvas || !canvas.width || !canvas.height) {
    throw new Error("Canvas rendering failed");
  }

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let position = 0;
  let remainingHeight = imgHeight;

  // ✅ MULTI-PAGE SUPPORT (VERY IMPORTANT)
  while (remainingHeight > 0) {
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    remainingHeight -= pdfHeight;
    position -= pdfHeight;

    if (remainingHeight > 0) pdf.addPage();
  }

  return pdf.output("blob");
};
