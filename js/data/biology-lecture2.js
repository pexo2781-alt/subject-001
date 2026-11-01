export const lecture2 = {
  id: "lecture-2",
  title: "Lecture 2: Structure of DNA and RNA",
  concepts: [
    {
      id: "c1",
      name: "Nucleotides and Nucleosides",
      questions: [
        {
          type: "typed",
          prompt: "What are the three chemical components that make up a nucleotide?",
          answer: "sugar, base, phosphate",
          accept: [
            "sugar base phosphate",
            "a sugar a base and a phosphate",
            "pentose sugar nitrogenous base phosphate",
            "phosphate sugar base",
            "sugar phosphate base"
          ],
          explanation: "A nucleotide = a pentose sugar + a nitrogenous base + at least one phosphate group. Remove the phosphate and you are left with a nucleoside (base + sugar)."
        },
        {
          type: "fill",
          prompt: "A nitrogenous base covalently linked to a pentose sugar, but with no phosphate group, is called a ________.",
          answer: "nucleoside",
          explanation: "Base + sugar = nucleoside (e.g. adenosine, cytidine). Add a phosphate and it becomes a nucleotide (e.g. AMP, CMP)."
        },
        {
          type: "sequence",
          prompt: "Order these from smallest to most complex building block of a nucleic acid:",
          steps: [
            "Nitrogenous base",
            "Nucleoside (base + sugar)",
            "Nucleotide (base + sugar + phosphate)",
            "Polynucleotide (linked nucleotides)"
          ],
          explanation: "A base alone is not a nucleotide. Add a sugar → nucleoside. Add a phosphate → nucleotide. Link many nucleotides by phosphodiester bonds → a polynucleotide strand."
        },
        {
          type: "mcq",
          prompt: "Which pair correctly describes the sugar found in DNA versus RNA?",
          options: [
            "DNA = ribose; RNA = 2-deoxyribose",
            "DNA = 2-deoxyribose; RNA = ribose",
            "DNA = glucose; RNA = ribose",
            "DNA and RNA both contain 2-deoxyribose"
          ],
          answer: 1,
          explanation: "DNA contains 2-deoxyribose (no OH at the 2' carbon); RNA contains ribose (OH present at the 2' carbon). This single difference makes RNA far more chemically reactive and less stable than DNA."
        },
        {
          type: "tf",
          prompt: "ATP is a nucleotide that carries three phosphate groups, whereas dTDP carries two.",
          answer: true,
          reason: "Adenosine triphosphate (ATP) has three phosphates; deoxythymidine diphosphate (dTDP) has two. Nucleotides may be mono-, di-, or tri-phosphates.",
          wrong_reasons: [
            "ATP is a nucleoside, not a nucleotide, because it has no phosphate.",
            "dTDP carries three phosphates, whereas ATP carries two."
          ],
          explanation: "The number of phosphate groups is variable: nucleotide mono-, di-, and tri-phosphates all exist. ATP is the tri-phosphate form of adenosine; dTDP is the di-phosphate form of deoxythymidine."
        },
        {
          type: "match",
          prompt: "Match each base to the correct ribonucleoside name:",
          pairs: [
            { left: "Adenine", right: "Adenosine" },
            { left: "Cytosine", right: "Cytidine" },
            { left: "Guanine", right: "Guanosine" },
            { left: "Uracil", right: "Uridine" }
          ],
          explanation: "Ribonucleosides take the base name with an '-osine' or '-idine' suffix: adenine→adenosine, cytosine→cytidine, guanine→guanosine, uracil→uridine."
        }
      ]
    },
    {
      id: "c2",
      name: "Nitrogenous Bases (Purines & Pyrimidines)",
      questions: [
        {
          type: "typed",
          prompt: "Which four nitrogenous bases are found in DNA?",
          answer: "adenine, guanine, cytosine, thymine",
          accept: [
            "a g c t",
            "a c g t",
            "adenine guanine cytosine thymine",
            "adenine cytosine guanine thymine",
            "agct"
          ],
          explanation: "DNA contains A, G, C, and T. RNA replaces thymine with uracil (A, G, C, U)."
        },
        {
          type: "fill",
          prompt: "In RNA, the base ________ replaces the thymine found in DNA.",
          answer: "uracil",
          explanation: "Uracil (U) is used in RNA in place of thymine (T). Both are pyrimidines, but U lacks the 5-methyl group present on T."
        },
        {
          type: "sequence",
          prompt: "Order these bases from the purines to the pyrimidines (purines first, then pyrimidines, each group in the order given in the lecture):",
          steps: [
            "Adenine",
            "Guanine",
            "Cytosine",
            "Thymine",
            "Uracil"
          ],
          explanation: "Adenine and guanine are purines (two-ringed: a purine ring). Cytosine, thymine, and uracil are pyrimidines (single six-membered ring: a pyrimidine ring)."
        },
        {
          type: "mcq",
          prompt: "Which of the following statements about purines and pyrimidines is correct?",
          options: [
            "Adenine and cytosine are purines; guanine and thymine are pyrimidines.",
            "Adenine and guanine are purines; cytosine, thymine, and uracil are pyrimidines.",
            "Thymine and uracil are purines; adenine and guanine are pyrimidines.",
            "All four DNA bases are pyrimidines."
          ],
          answer: 1,
          explanation: "Purines = adenine + guanine (double-ring). Pyrimidines = cytosine + thymine + uracil (single ring)."
        },
        {
          type: "tf",
          prompt: "The four bases found in RNA are adenine, guanine, cytosine, and thymine.",
          answer: false,
          reason: "RNA contains adenine, guanine, cytosine, and uracil — not thymine. Thymine is specific to DNA.",
          wrong_reasons: [
            "True: RNA contains the same four bases as DNA.",
            "False: RNA contains only two bases, adenine and uracil."
          ],
          explanation: "The bases in RNA are A, G, C, and U. Thymine (T) is found only in DNA; uracil (U) is found only in RNA."
        },
        {
          type: "match",
          prompt: "Match each base to whether it is a purine or a pyrimidine:",
          pairs: [
            { left: "Adenine", right: "Purine" },
            { left: "Guanine", right: "Purine" },
            { left: "Cytosine", right: "Pyrimidine" },
            { left: "Thymine", right: "Pyrimidine" }
          ],
          explanation: "Purines are the double-ringed bases (A and G). Pyrimidines are the single-ringed bases (C, T, and U)."
        }
      ]
    },
    {
      id: "c3",
      name: "Chargaff's Rules and DNA Composition",
      questions: [
        {
          type: "typed",
          prompt: "What is the relationship between the amounts of adenine and thymine in a DNA molecule?",
          answer: "they are equal",
          accept: [
            "equal",
            "a equals t",
            "a = t",
            "they are the same",
            "adenine equals thymine",
            "same amount"
          ],
          explanation: "A and T are always present in roughly equal proportions, as are G and C. This is the basis of Chargaff's rules, and reflects complementary base pairing."
        },
        {
          type: "fill",
          prompt: "In the DNA base-composition data, guanine and ________ are always present in roughly equal amounts.",
          answer: "cytosine",
          explanation: "Chargaff's data show G ≈ C and A ≈ T. The molar proportion of G equals that of C because G pairs with C."
        },
        {
          type: "sequence",
          prompt: "Using the base composition table, order these DNA sources by their A content from lowest to highest (Sarcinia, E. coli, human, sea urchin):",
          steps: [
            "Sarcinia (13.4% A)",
            "E. coli (24.7% A)",
            "Human (30.9% A)",
            "Sea urchin (32.8% A)"
          ],
          explanation: "Chargaff's table shows A content varies between species: Sarcinia 13.4%, E. coli 24.7%, human 30.9%, sea urchin 32.8%. But within each species, A ≈ T and G ≈ C."
        },
        {
          type: "mcq",
          prompt: "What does the observation that A ≈ T and G ≈ C in DNA most strongly suggest?",
          options: [
            "That DNA is single-stranded.",
            "That bases pair with each other in equal amounts (A with T, G with C).",
            "That thymine is a purine.",
            "That the ratio of A+T to G+C is always 1:1 across all species."
          ],
          answer: 1,
          explanation: "Chargaff's rules (A=T, G=C) are the chemical clue that led Watson and Crick to complementary base pairing: every A on one strand pairs with a T on the other, and every G with a C."
        },
        {
          type: "tf",
          prompt: "According to Chargaff's data, the ratio of (A+T) to (G+C) is identical in every species.",
          answer: false,
          reason: "The A=T and G=C equalities hold within a species, but the *ratio* of (A+T) to (G+C) varies between species — e.g. Sarcinia is high in G+C, while sea urchin is high in A+T.",
          wrong_reasons: [
            "True: all DNA has the same A+T to G+C ratio of exactly 1:1.",
            "False: Chargaff found A pairs with G and T pairs with C."
          ],
          explanation: "Chargaff's rules are: within a species, A=T and G=C. Between species, the (A+T):(G+C) ratio varies considerably, which is why base composition is species-specific."
        },
        {
          type: "match",
          prompt: "Match each base-composition observation to its meaning:",
          pairs: [
            { left: "A ≈ T", right: "Adenine pairs with thymine" },
            { left: "G ≈ C", right: "Guanine pairs with cytosine" },
            { left: "(A+T):(G+C) varies by species", right: "Base composition is species-specific" }
          ],
          explanation: "Equal A=T and G=C amounts reflect complementary base pairing. The species-specific variation in overall composition is one of the key facts that supported DNA as the genetic material."
        }
      ]
    },
    {
      id: "c4",
      name: "The DNA Double Helix",
      questions: [
        {
          type: "typed",
          prompt: "How many hydrogen bonds hold together a guanine-cytosine (G-C) base pair?",
          answer: "3",
          accept: ["three", "3 hydrogen bonds"],
          explanation: "A G-C pair is held by 3 hydrogen bonds. An A-T pair is held by only 2. This is why GC-rich DNA is more thermally stable."
        },
        {
          type: "fill",
          prompt: "The two strands of DNA run in opposite directions and are therefore said to be ________.",
          answer: "antiparallel",
          explanation: "One strand runs 5'→3' and the other runs 3'→5'. This antiparallel arrangement is a defining feature of the double helix."
        },
        {
          type: "sequence",
          prompt: "Put the key facts about the B-DNA double helix in the order they appear in the lecture:",
          steps: [
            "The helix is 2 nm in diameter",
            "One complete turn is 3.4 nm long",
            "There are 10 base pairs per complete turn",
            "Each base pair is 0.34 nm from the next"
          ],
          explanation: "The B-DNA helix has a 2 nm diameter, one turn every 3.4 nm, with 10 base pairs per turn (so 3.4 nm / 10 = 0.34 nm between successive base pairs)."
        },
        {
          type: "mcq",
          prompt: "Which of the following correctly describes complementary base pairing in DNA?",
          options: [
            "A pairs with G (3 H-bonds); T pairs with C (2 H-bonds).",
            "A pairs with T (2 H-bonds); G pairs with C (3 H-bonds).",
            "A pairs with C (2 H-bonds); G pairs with T (3 H-bonds).",
            "All base pairs are held by the same number of hydrogen bonds."
          ],
          answer: 1,
          explanation: "A-T pairs form 2 hydrogen bonds; G-C pairs form 3. Purines always pair with pyrimidines, which keeps the helix at a uniform 2 nm width."
        },
        {
          type: "tf",
          prompt: "The two strands of DNA are held together primarily by covalent phosphodiester bonds between the bases.",
          answer: false,
          reason: "The two strands are held together by hydrogen bonds between complementary bases. Phosphodiester bonds are covalent linkages *within* each strand (between the sugar of one nucleotide and the phosphate of the next).",
          wrong_reasons: [
            "True: phosphodiester bonds hold the two strands together.",
            "False: the two strands are held together by ionic bonds between phosphates."
          ],
          explanation: "Phosphodiester bonds are the covalent backbone of a single strand. The two strands are held to each other by hydrogen bonds between A-T and G-C base pairs, plus base-stacking interactions."
        },
        {
          type: "match",
          prompt: "Match each structural feature of DNA to its correct value or description:",
          pairs: [
            { left: "Helix diameter", right: "2 nm" },
            { left: "Distance per full turn", right: "3.4 nm" },
            { left: "Base pairs per turn", right: "10" },
            { left: "Distance between adjacent base pairs", right: "0.34 nm" }
          ],
          explanation: "These are the standard B-DNA dimensions from the lecture: 2 nm diameter, 3.4 nm per turn, 10 bp/turn, 0.34 nm between adjacent base pairs."
        }
      ]
    },
    {
      id: "c5",
      name: "The Discovery of the Double Helix",
      questions: [
        {
          type: "typed",
          prompt: "Which scientist produced the X-ray diffraction photograph of DNA (Photograph 51) that was critical to the discovery of the double helix?",
          answer: "Rosalind Franklin",
          accept: ["rosalind franklin", "franklin", "rosalind"],
          explanation: "Rosalind Franklin's X-ray diffraction photograph (often called Photograph 51) revealed the helical structure of DNA and was crucial evidence for Watson and Crick's model."
        },
        {
          type: "fill",
          prompt: "In X-ray crystallography, a DNA crystal is placed in a beam of ________, which produces a regular pattern of reflections that reveals atomic positions.",
          answer: "X-rays",
          accept: ["x-rays", "x rays", "xrays"],
          explanation: "X-rays are diffracted by the regularly spaced atoms in a DNA crystal, producing a diffraction pattern. The intensity of every spot, at every orientation of the crystal, reveals the position of atoms in the molecule."
        },
        {
          type: "sequence",
          prompt: "Order the steps of the X-ray crystallography workflow shown in the lecture:",
          steps: [
            "Obtain a crystal of DNA",
            "Expose it to X-rays",
            "Record the diffraction pattern",
            "Calculate electron density",
            "Fit an atomic model"
          ],
          explanation: "A crystal is exposed to X-rays, the diffraction pattern is recorded, phases are determined, an electron density map is built, and an atomic model is fitted and refined against the data."
        },
        {
          type: "mcq",
          prompt: "Who proposed the double-helix model of DNA in 1953?",
          options: [
            "Rosalind Franklin and Maurice Wilkins",
            "James Watson and Francis Crick",
            "Erwin Chargaff and Oswald Avery",
            "Frederick Griffith and Colin MacLeod"
          ],
          answer: 1,
          explanation: "Watson and Crick published the double-helix model in Nature in 1953. Their model relied heavily on Franklin's X-ray data and Chargaff's base-composition rules."
        },
        {
          type: "tf",
          prompt: "Rosalind Franklin's X-ray diffraction data were unimportant to Watson and Crick's model of DNA.",
          answer: false,
          reason: "Franklin's X-ray diffraction data — especially Photograph 51 — were essential evidence for the helical structure, and her measurements helped establish the dimensions of the double helix.",
          wrong_reasons: [
            "True: Watson and Crick solved the structure without any experimental DNA data.",
            "False: the double helix was discovered by Franklin alone, without Watson or Crick."
          ],
          explanation: "Watson and Crick's model depended on Franklin's X-ray data and Wilkins's work, as well as Chargaff's base ratios. Franklin's contribution is now widely credited as central to the discovery."
        },
        {
          type: "match",
          prompt: "Match each scientist to their key contribution to DNA structure:",
          pairs: [
            { left: "Rosalind Franklin", right: "X-ray diffraction photograph of DNA" },
            { left: "Watson and Crick", right: "Double-helix model" },
            { left: "Erwin Chargaff", right: "A=T and G=C base ratios" }
          ],
          explanation: "Franklin produced the X-ray data, Watson and Crick built the model, and Chargaff established the base-composition rules that the model had to explain."
        }
      ]
    },
    {
      id: "c6",
      name: "RNA: Structure and Types",
      questions: [
        {
          type: "typed",
          prompt: "Name the three main types of RNA discussed in the lecture.",
          answer: "mRNA, tRNA, rRNA",
          accept: [
            "mrna trna rrna",
            "messenger rna transfer rna ribosomal rna",
            "messenger transfer ribosomal",
            "mrna trna and rrna"
          ],
          explanation: "The three main types of RNA are messenger RNA (mRNA), transfer RNA (tRNA), and ribosomal RNA (rRNA)."
        },
        {
          type: "fill",
          prompt: "The type of RNA that carries the genetic message from DNA to the ribosome for translation into protein is ________ RNA.",
          answer: "messenger",
          accept: ["messenger", "mrna", "mRNA"],
          explanation: "mRNA is a single-stranded copy of a DNA sequence that is translated into protein at the ribosome."
        },
        {
          type: "sequence",
          prompt: "Order these steps in the flow of genetic information (the Central Dogma) as shown in the lecture:",
          steps: [
            "DNA",
            "Pre-mRNA (primary transcript)",
            "mRNA",
            "Protein"
          ],
          explanation: "DNA is transcribed into pre-mRNA, processed into mature mRNA, exported from the nucleus, and translated into protein. This directional flow of information is the Central Dogma."
        },
        {
          type: "mcq",
          prompt: "Which statement about tRNA structure is correct?",
          options: [
            "tRNA is double-stranded along its entire length.",
            "tRNA is synthesised as a single strand but folds into double-stranded regions via complementary base pairing.",
            "tRNA has no secondary structure and is a simple straight chain.",
            "tRNA is made of DNA, not RNA."
          ],
          answer: 1,
          explanation: "tRNA is transcribed as a single strand, but it folds into a characteristic cloverleaf secondary structure with double-stranded stems (acceptor stem, D loop, TψCG loop, anticodon loop) formed by intramolecular complementary base pairing."
        },
        {
          type: "tf",
          prompt: "Ribosomal RNA (rRNA) is a structural and catalytic component of the ribosome.",
          answer: true,
          reason: "rRNA is a major component of both the large and small ribosomal subunits, and the catalytic activity of the ribosome (peptidyl transferase) is carried out by rRNA.",
          wrong_reasons: [
            "False: rRNA is only a minor contaminant in the ribosome and has no function.",
            "False: the ribosome is made entirely of protein, with no RNA."
          ],
          explanation: "rRNA forms the core of the ribosome and catalyses peptide bond formation, making it both a structural and a catalytic component of protein synthesis."
        },
        {
          type: "match",
          prompt: "Match each RNA type to its primary function:",
          pairs: [
            { left: "mRNA", right: "Carries the coding message to the ribosome" },
            { left: "tRNA", right: "Delivers amino acids to the ribosome" },
            { left: "rRNA", right: "Forms the core of the ribosome and catalyses peptide bond formation" }
          ],
          explanation: "mRNA is the messenger, tRNA is the adaptor that brings amino acids, and rRNA is the structural and catalytic core of the ribosome."
        }
      ]
    }
  ]
};
