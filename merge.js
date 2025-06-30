const PDFMerger = require('pdf-merger-js');

const mergePdfs = async (p1, p2) => {
  console.log('🔧 Merging:', p1, 'and', p2);
  const merger = new PDFMerger();
  await merger.add(p1);
  await merger.add(p2);
  await merger.save('public/merged.pdf');
  console.log('✅ Merge complete');
};

module.exports = { mergePdfs };

