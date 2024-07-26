

// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const { Document, Packer, Paragraph, TextRun, AlignmentType, ImageRun } = require('docx');

// const app = express();
// const port = 3001;

// // Middleware setup
// app.use(bodyParser.json());
// app.use(cors());

// // Ensure the uploads directory exists
// if (!fs.existsSync('uploads')) {
//   fs.mkdirSync('uploads');
// }

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage });

// // Helper functions
// const cmToTwips = (cm) => Math.round(cm * 567);
// const capitalizeWords = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());
// const lineHeight = 1.5 * 240;
// const referenceLineHeight = 1.5 * 240;
// const firstLineIndent = cmToTwips(1.27);

// // Margin definitions
// const topMargin = cmToTwips(2.65);
// const rightMargin = cmToTwips(2.54);
// const bottomMargin = cmToTwips(1.68);
// const leftMargin = cmToTwips(2.54);

// // Function to split text into paragraphs with specific formatting
// const splitTextIntoParagraphs = (text, isReferenceSection = false, size = 24) => {
//   const lines = text.split('\n');

//   return lines.map((line, index) => {
//     return new Paragraph({
//       alignment: AlignmentType.JUSTIFIED,
//       indent: isReferenceSection ? {} : (index === 0 ? { firstLine: firstLineIndent } : {}),
//       spacing: { line: isReferenceSection ? referenceLineHeight : lineHeight },
//       children: [new TextRun({ text: line, size, preserveWhitespace: true })],
//     });
//   });
// };

// // Function to split text into runs, handling superscripts
// const splitTextIntoRuns = (text, isAffiliation = false) => {
//   const runs = [];
//   let currentRun = {
//     text: '',
//     size: isAffiliation ? 22 : 32,  // Use size 11 for affiliation
//     bold: !isAffiliation,           // Default to bold unless in affiliation section
//     superScript: false,
//   };  

//   for (const char of text) {
//     const isSuperScript = /\d/.test(char) || (isAffiliation && char === ',');

//     if (isSuperScript && !currentRun.superScript) {
//       if (currentRun.text) {
//         // Push the current run to the array before starting a new one
//         runs.push(new TextRun(currentRun));
//       }
//       // Start a new superscript run
//       currentRun = {
//         text: '',
//         size: isAffiliation ? 22 : 32,  // Use size 11 for superscript in affiliation
//         bold: isAffiliation ? false : true,                    // Superscript should be unbolded
//         superScript: true,
//       };
//     } else if (!isSuperScript && currentRun.superScript) {
//       if (currentRun.text) {
//         // Push the current superscript run to the array
//         runs.push(new TextRun(currentRun));
//       }
//       // Start a new normal run
//       currentRun = {
//         text: '',
//         size: isAffiliation ? 22 : 32,
//         bold: !isAffiliation,
//         superScript: false,
//       };
//     }

//     currentRun.text += char;
//   }

//   // Push the last run to the array
//   if (currentRun.text) {
//     runs.push(new TextRun(currentRun));
//   }

//   return runs;
// };






// // Handle file uploads and document generation
// app.post('/submit', upload.array('images'), async (req, res, next) => {
//   try {
//     const { title, name, abstract, keywords, sections, references, affiliation } = JSON.parse(req.body.data);


//     const splitAffiliationIntoParagraphs = (text) => {
//       const lines = text.split('\n');
      
//       return lines.map(line => new Paragraph({
//         alignment: AlignmentType.JUSTIFIED,
//         spacing: { line: lineHeight },
//         indent: {}, // No indentation for affiliation section
//         children: splitTextIntoRuns(line, true, 22),
//       }));
//     };
    



//     const docSections = [
//       new Paragraph({
//         alignment: AlignmentType.CENTER,
//         spacing: { line: lineHeight },
//         children: [new TextRun({ text: title, bold: true, size: 48 })],
//         spacing: { after: 400 },
//       }),
//       new Paragraph({ spacing: { line: lineHeight }, children: splitTextIntoRuns(name) }),
//       // new Paragraph({
//       //   spacing: { line: lineHeight },
//       //   children: [new TextRun({ text: 'Affiliation', size: 22 })],
//       //   spacing: { before: 400, after: 200 },
//       // }),
//       splitAffiliationIntoParagraphs(affiliation),

//       new Paragraph({
//         spacing: { line: lineHeight },
//         children: [new TextRun({ text: 'Abstract', bold: true, size: 24 })],
//         spacing: { before: 400, after: 200 },
//       }),
//       ...splitTextIntoParagraphs(abstract),
//       new Paragraph({
//         spacing: { line: lineHeight },
//         children: [
//           new TextRun({ text: 'Keywords: ', bold: true, size: 24 }),
//           new TextRun({ text: keywords, size: 24 }),
//         ],
//       })
//     ];

//     for (let i = 0; i < sections.length; i++) {
//       const section = sections[i];
//       docSections.push(
//         new Paragraph({
//           spacing: { line: lineHeight },
//           children: [new TextRun({ text: section.title, bold: true, size: 24 })],
//           spacing: { before: 400, after: 200 },
//         }),
//         ...splitTextIntoParagraphs(section.content)
//       );

//       if (req.files[i] && req.files[i].originalname) {
//         const imagePath = path.join(__dirname, 'uploads', req.files[i].originalname);
//         try {
//           const imageBuffer = fs.readFileSync(imagePath);
//           docSections.push(
//             new Paragraph({
//               alignment: AlignmentType.CENTER,
//               children: [
//                 new ImageRun({
//                   data: imageBuffer,
//                   transformation: {
//                     width: 250,
//                     height: 250,
//                   },
//                 }),
//               ],
//               spacing: { before: 200, after: 200 },
//             }),
//             new Paragraph({
//               alignment: AlignmentType.CENTER,
//               spacing: { line: lineHeight },
//               children: [
//                 new TextRun({ text: `Figure ${figurenumber++}. `, bold: true, size: 24 }),
//                 new TextRun({ text: section.figure, size: 24 }),
//               ],
//             })
//           );
//         } catch (error) {
//           console.error('Error reading image file:', error);
//         }
//       }

//       section.subheadings.forEach((subheading) => {
//         docSections.push(
//           new Paragraph({
//             spacing: { line: lineHeight },
//             children: [new TextRun({ text: subheading, bold: true, size: 24 })],
//             spacing: { before: 400, after: 200 },
//           }),
//           ...splitTextIntoParagraphs(subheading)
//         );
//       });
//     }

//     docSections.push(
//       new Paragraph({
//         spacing: { line: lineHeight },
//         children: [new TextRun({ text: 'References', bold: true, size: 24 })],
//         spacing: { before: 400, after: 200 },
//       }),
//       ...splitTextIntoParagraphs(references, true)
//     );

//     const doc = new Document({
//       sections: [{
//         properties: { margin: { top: topMargin, right: rightMargin, bottom: bottomMargin, left: leftMargin } },
//         children: docSections,
//       }],
//     });

//     const buffer = await Packer.toBuffer(doc);
//     res.writeHead(200, {
//       'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//       'Content-Disposition': 'attachment; filename="document.docx"',
//       'Content-Length': buffer.length,
//     });
//     res.end(buffer);
//     console.log('Document generated and sent successfully.');
//   } catch (error) {
//     console.error('Error generating document:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });



const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, AlignmentType, ImageRun } = require('docx');

const app = express();
const port = 3001;

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Helper functions
const cmToTwips = (cm) => Math.round(cm * 567);
const lineHeight = 1.5 * 240;
const referenceLineHeight = 1.5 * 240;
const firstLineIndent = cmToTwips(1.27);

// Margin definitions
const topMargin = cmToTwips(2.65);
const rightMargin = cmToTwips(2.54);
const bottomMargin = cmToTwips(1.68);
const leftMargin = cmToTwips(2.54);

// Function to split text into paragraphs with specific formatting
const splitTextIntoParagraphs = (text, isReferenceSection = false, fontSize = 24) => {
  const lines = text.split('\n');
  return lines.map((line, index) => new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: isReferenceSection ? {} : (index === 0 ? { firstLine: firstLineIndent } : {}),
    spacing: { line: isReferenceSection ? referenceLineHeight : lineHeight },
    children: [new TextRun({ text: line, size: fontSize, preserveWhitespace: true })],
  }));
};

// Function to split text into runs, handling superscripts
const splitTextIntoRuns = (text, isAffiliation = false) => {
  const runs = [];
  let currentRun = {
    text: '',
    size: isAffiliation ? 22 : 32,
    bold: !isAffiliation,
    superScript: false,
  };

  for (const char of text) {
    const isSuperScript = /\d/.test(char) || (isAffiliation && char === ',');

    if (isSuperScript && !currentRun.superScript) {
      if (currentRun.text) {
        runs.push(new TextRun(currentRun));
      }
      currentRun = {
        text: '',
        size: isAffiliation ? 22 : 32,
        bold: !isAffiliation,
        superScript: true,
      };
    } else if (!isSuperScript && currentRun.superScript) {
      if (currentRun.text) {
        runs.push(new TextRun(currentRun));
      }
      currentRun = {
        text: '',
        size: isAffiliation ? 22 : 32,
        bold: !isAffiliation,
        superScript: false,
      };
    }

    currentRun.text += char;
  }

  if (currentRun.text) {
    runs.push(new TextRun(currentRun));
  }

  return runs;
};

// Function to split affiliation text into paragraphs
const splitAffiliationIntoParagraphs = (text) => {
  const lines = text.split('\n');
  return lines.map(line => new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: lineHeight },
    indent: {}, // No indentation for affiliation section
    children: splitTextIntoRuns(line, true),
  }));
};

// Function to format emails into superscript runs


// Function to format emails into Paragraphs
const formatEmails = (emailString) => {
  // Split the input string by commas and trim any extra whitespace
  const emailArray = emailString.split(',').map(email => email.trim());

  // Create the label text run
  const labelRun = new TextRun({
    text: 'E-mail: ',
    bold: true,
    size: 18 
  });

  // Create an array to hold formatted runs
  const formattedEmails = emailArray.flatMap((email, index) => {
    // Separate the first character from the rest of the email address
    const firstChar = email.charAt(0);
    const restOfEmail = email.slice(1);

    // Create superscript text run for the first character
    const firstCharRun = new TextRun({
      text: firstChar,
      size: 18,
      superScript: true // Make this text superscript
    });

    // Create normal text run for the rest of the email address
    const restOfEmailRun = new TextRun({
      text: restOfEmail,
      size: 18
    });

    // Add the comma and space after each email except the last one
    const separator = (index < emailArray.length - 1) ? ', ' : '';

    // Create a text run for the separator
    const separatorRun = new TextRun({
      text: separator,
      size: 18
    });

    // Combine the superscript first character, the rest of the email, and the separator
    return [firstCharRun, restOfEmailRun, separatorRun];
  });

  // Return a single paragraph with the label and all email runs joined together
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { line: lineHeight },
    children: [labelRun, ...formattedEmails]
  });
};




// Inside the POST route handler
app.post('/submit', upload.array('images'), async (req, res) => {
  try {
    const { title, name, abstract, keywords, sections, references, affiliation, email } = JSON.parse(req.body.data);

    const docSections = [
      // new Paragraph({
      //   alignment: AlignmentType.CENTER,
      //   spacing: { line: lineHeight },
      //   children: [new TextRun({ text: title, bold: true, size: 48 })],
      //   spacing: { after: 400 },
      // }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: {
          line: lineHeight, 
          
        },
        children: [
          new TextRun({
            text: title,
            bold: true,
            size: 48 // Font size 24 pt (docx uses half-points)
          })
        ]
      }),
      new Paragraph({ spacing: { line: lineHeight }, children: splitTextIntoRuns(name) }),
      ...splitAffiliationIntoParagraphs(affiliation),
      formatEmails(email),  // Ensure formatEmails() is used correctly
      new Paragraph({
        spacing: { line: lineHeight },
        children: [new TextRun({ text: 'Abstract', bold: true, size: 24 })],
        spacing: { after: 200 },
      }),
      ...splitTextIntoParagraphs(abstract),
      new Paragraph({
        spacing: { line: lineHeight },
        children: [
          new TextRun({ text: 'Keywords: ', bold: true, size: 24 }),
          new TextRun({ text: keywords, size: 24 }),
        ],
      }),
    ];

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      docSections.push(
        new Paragraph({
          spacing: { line: lineHeight },
          children: [new TextRun({ text: section.title, bold: true, size: 24 })],
          spacing: { before: 400, after: 200 },
        }),
        ...splitTextIntoParagraphs(section.content)
      );

      if (req.files[i] && req.files[i].originalname) {
        const imagePath = path.join(__dirname, 'uploads', req.files[i].originalname);
        try {
          const imageBuffer = fs.readFileSync(imagePath);
          docSections.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new ImageRun({
                  data: imageBuffer,
                  transformation: {
                    width: 250,
                    height: 250,
                  },
                }),
              ],
              spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { line: lineHeight },
              children: [
                new TextRun({ text: `Figure ${i + 1}. `, bold: true, size: 24 }),
                new TextRun({ text: section.figure, size: 24 }),
              ],
            })
          );
        } catch (error) {
          console.error('Error reading image file:', error);
        }
      }

      section.subheadings.forEach((subheading) => {
        docSections.push(
          new Paragraph({
            spacing: { line: lineHeight },
            children: [new TextRun({ text: subheading, bold: true, size: 24 })],
            spacing: { before: 400, after: 200 },
          }),
          ...splitTextIntoParagraphs(subheading)
        );
      });
    }

    docSections.push(
      new Paragraph({
        spacing: { line: lineHeight },
        children: [new TextRun({ text: 'References', bold: true, size: 24 })],
        spacing: { before: 400, after: 200 },
      }),
      ...splitTextIntoParagraphs(references, true)
    );

    const doc = new Document({
      sections: [{
        properties: { margin: { top: topMargin, right: rightMargin, bottom: bottomMargin, left: leftMargin } },
        children: docSections,
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    res.writeHead(200, {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename="document.docx"',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
    console.log('Document generated and sent successfully.');
  } catch (error) {
    console.error('Error generating document:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
