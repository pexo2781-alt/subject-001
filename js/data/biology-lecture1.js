export const lecture1 = {
  id: "lecture-1",
  title: "Lecture 1: Heredity and DNA",
  concepts: [
    {
      id: "c1",
      name: "Transmission Genetics",
      questions: [
        {
          type: "typed",
          prompt: "In Mendel's F2 generation, what is the approximate ratio of dominant to recessive phenotypes?",
          answer: "3:1",
          accept: ["3 to 1", "3 : 1"],
          explanation: "The 3:1 ratio occurs because crossing two heterozygotes (Lele x Lele) yields a 25% chance of homozygous recessive (lele) and a 75% chance of having at least one dominant allele (Le)."
        },
        {
          type: "fill",
          prompt: "The early theory that chromosomes carry the units of inheritance, proposed by Sutton and Boveri in 1902, is called the ________ theory of inheritance.",
          answer: "chromosome",
          explanation: "The chromosome theory of inheritance states that genes are located on chromosomes, and the behavior of chromosomes during meiosis explains Mendel's laws of inheritance."
        },
        {
          type: "sequence",
          prompt: "Put the stages of meiosis in the correct order based on the chromosome segregation diagram:",
          steps: [
            "Chromosome replication",
            "Meiosis I (first meiotic division)",
            "Meiosis II (second meiotic division)",
            "F1 Gametes formed"
          ],
          explanation: "Meiosis begins with DNA replication. Homologous chromosomes separate in Meiosis I, sister chromatids separate in Meiosis II, resulting in haploid gametes."
        },
        {
          type: "mcq",
          prompt: "In the Punnett square for a cross between two heterozygous tall plants (Lele x Lele), what is the genotypic ratio?",
          options: [
            "1 LeLe : 2 Lele : 1 lele",
            "3 LeLe : 1 lele",
            "1 LeLe : 1 lele",
            "2 LeLe : 1 Lele : 1 lele"
          ],
          answer: 0,
          explanation: "The Punnett square produces 1 LeLe (homozygous dominant), 2 Lele (heterozygous), and 1 lele (homozygous recessive)."
        },
        {
          type: "tf",
          prompt: "The dwarf phenotype in the Le/le experiment is caused by a dominant mutant allele.",
          answer: false,
          reason: "The dwarf phenotype is recessive. The wild-type tall allele (Le) is dominant, while the mutant dwarf allele (le) is recessive.",
          wrong_reasons: [
            "The dwarf phenotype is caused by a chromosomal deletion, not an allele.",
            "The dwarf phenotype is caused by a dominant mutant allele."
          ],
          explanation: "Because the Le (tall) allele is dominant, a plant only needs one copy to be tall. Dwarfism requires two copies of the recessive le allele (lele)."
        },
        {
          type: "match",
          prompt: "Match the genotype to its phenotype in the Le/le experiment:",
          pairs: [
            { left: "LeLe", right: "Tall" },
            { left: "Lele", right: "Tall" },
            { left: "lele", right: "Dwarf" }
          ],
          explanation: "Le is the dominant functional allele, so LeLe and Lele are both tall. The mutant le allele is recessive, so only lele produces a dwarf plant."
        }
      ]
    },
    {
      id: "c2",
      name: "Griffith's Transformation Experiment",
      questions: [
        {
          type: "typed",
          prompt: "What did Griffith call the process where a heat-killed virulent strain changes an avirulent strain to virulence?",
          answer: "transformation",
          accept: ["transformation"],
          explanation: "Griffith coined the term 'transformation' to describe the change in phenotype and genotype of the avirulent strain after exposure to the heat-killed virulent strain."
        },
        {
          type: "fill",
          prompt: "Griffith used the bacteria *Streptococcus pneumoniae*. The virulent strain had a ________ colony appearance, while the avirulent strain had a rough appearance.",
          answer: "smooth",
          explanation: "The virulent strain (IIIS) has a polysaccharide capsule, giving it a smooth appearance on agar. The avirulent strain (IIR) lacks the capsule and appears rough."
        },
        {
          type: "sequence",
          prompt: "Put the steps of Griffith's critical experiment in order (mice were injected with):",
          steps: [
            "Living IIIS (smooth) bacteria only → Mouse dies",
            "Living IIR (rough) bacteria only → Mouse lives",
             "Heat-killed IIIS (smooth) bacteria only → Mouse lives",
            "Living IIR (rough) + Heat-killed IIIS (smooth) → Mouse dies"
          ],
          explanation: "Griffith proved that the heat-killed virulent bacteria could pass on their virulence to the living avirulent bacteria."
        },
        {
          type: "mcq",
          prompt: "Which of the following describes the living bacteria recovered from the dead mouse in Griffith's critical experiment?",
          options: [
            "Living IIR (rough), avirulent",
            "Living IIIS (smooth), virulent",
            "A mixture of dead IIIS and living IIR",
            "Living IIR that had mutated into a new strain"
          ],
          answer: 1,
          explanation: "The live IIR bacteria had been 'transformed' by the dead IIIS bacteria, acquiring the ability to make a capsule and becoming virulent IIIS."
        },
        {
          type: "tf",
          prompt: "Griffith's experiment proved that DNA was the 'transforming principle'.",
          answer: false,
          reason: "Griffith only discovered the *phenomenon* of transformation. He did not identify what the chemical substance was. That was discovered later by Avery, MacLeod, and McCarty.",
          wrong_reasons: [
            "Griffith's experiment proved that proteins were the transforming principle.",
            "Griffith used a light microscope to see the DNA moving between cells."
          ],
          explanation: "Griffith only observed the *effect* (transformation). It took Avery, MacLeod, and McCarty to isolate the specific molecule (DNA) responsible."
        },
        {
          type: "match",
          prompt: "Match the strain type to its characteristics:",
          pairs: [
            { left: "IIIS", right: "Smooth, virulent" },
            { left: "IIR", right: "Rough, avirulent" }
          ],
          explanation: "The S stands for Smooth (capsule present, virulent). The R stands for Rough (no capsule, avirulent)."
        }
      ]
    },
    {
      id: "c3",
      name: "Avery, MacLeod, and McCarty",
      questions: [
        {
          type: "typed",
          prompt: "Which specific enzyme treatment in the Avery-MacLeod-McCarty experiment resulted in 'No transformation' occurring?",
          answer: "deoxyribonuclease",
          accept: ["DNase", "deoxyribonuclease", "DNAse"],
          explanation: "DNase destroys DNA. When the DNA was destroyed, transformation did not occur, proving that DNA is the transforming principle."
        },
        {
          type: "fill",
          prompt: "In the Avery experiment, treating the extract with ________ resulted in transformation still occurring, proving that proteins were not the genetic material.",
          answer: "protease",
          explanation: "Protease destroys proteins. Because transformation still occurred after protein destruction, the genetic material could not be protein."
        },
        {
          type: "sequence",
          prompt: "Order the steps of the Avery-MacLeod-McCarty experiment:",
          steps: [
            "Culture IIIS (virulent) cells in liquid medium",
            "Centrifuge and heat-kill the cells",
            "Homogenize and extract carbohydrates, lipids, and proteins",
            "Treat filtrate with DNase, RNase, or Protease",
            "Assay for transformation with IIR cells"
          ],
          explanation: "Avery's team systematically destroyed different types of molecules to see which one, when destroyed, stopped transformation."
        },
        {
          type: "mcq",
          prompt: "If the filtrate was treated with RNase and then added to living IIR cells, what was the outcome?",
          options: [
            "No transformation occurred",
            "Transformation occurred, yielding living IIIS cells",
            "The cells died due to RNA toxicity",
            "The cells mutated into a different strain"
          ],
          answer: 1,
          explanation: "RNase destroys RNA. Because transformation still occurred, the genetic material was not RNA."
        },
        {
          type: "tf",
          prompt: "The Avery experiment concluded that RNA was the active factor in transformation.",
          answer: false,
          reason: "The experiment concluded that DNA was the active factor. RNase did not prevent transformation, but DNase did.",
          wrong_reasons: [
            "The experiment concluded that proteins were the active factor.",
            "The experiment was inconclusive because all enzymes prevented transformation."
          ],
          explanation: "Because RNase had no effect but DNase stopped transformation, the team concluded DNA was the active factor."
        },
        {
          type: "match",
          prompt: "Match the treatment to its conclusion in the Avery experiment:",
          pairs: [
            { left: "DNase treatment", right: "Active factor is DNA" },
            { left: "RNase treatment", right: "Active factor is not RNA" },
            { left: "Protease treatment", right: "Active factor is not protein" }
          ],
          explanation: "Only the destruction of DNA stopped transformation, isolating DNA as the genetic material."
        }
      ]
    },
    {
      id: "c4",
      name: "Recombinant DNA & Lab Transformation",
      questions: [
        {
          type: "typed",
          prompt: "Which chemical solution is used to make *Escherichia coli* competent for transformation?",
          answer: "calcium chloride",
          accept: ["calcium chloride", "cacl2"],
          explanation: "Calcium chloride (CaCl2) neutralizes the negative charges on the bacterial cell membrane and DNA, allowing the DNA to pass through during heat shock."
        },
        {
          type: "fill",
          prompt: "The pGLO plasmid contains a gene that makes *E. coli* glow green. When the bacteria successfully take up this plasmid, they are said to be ________.",
          answer: "transformed",
          explanation: "A cell that has successfully taken up foreign DNA (like a plasmid) is called transformed."
        },
        {
          type: "sequence",
          prompt: "Order the steps to make E. coli competent and transform them:",
          steps: [
            "Centrifuge the log phase E. coli culture",
            "Resuspend the pellet in CaCl2 solution",
            "Chill on ice",
            "Add plasmid DNA",
            "Heat shock at 42°C",
            "Plate on LB + ampicillin"
          ],
          explanation: "The process involves chilling to stabilize membranes, heat shock to create pores, and plating on antibiotics to select successful transformants."
        },
        {
          type: "mcq",
          prompt: "Why are the transformed cells plated on LB agar containing ampicillin?",
          options: [
            "Ampicillin helps the cells grow faster.",
            "Ampicillin kills cells that did not take up the plasmid (which contains an ampR gene).",
            "Ampicillin causes the pGLO gene to activate.",
            "Ampicillin is a nutrient required for E. coli survival."
          ],
          answer: 1,
          explanation: "The plasmid contains an ampicillin resistance gene (ampR). Only cells that took up the plasmid can survive on the ampicillin plate."
        },
        {
          type: "tf",
          prompt: "*Agrobacterium tumefaciens* uses a Ti plasmid to naturally transform plant cells, causing crown gall disease.",
          answer: true,
          reason: "Agrobacterium transfers its T-DNA (from the Ti plasmid) into the plant host, integrating it into the plant genome.",
          wrong_reasons: [
            "Agrobacterium transfers its entire chromosome into the plant cell.",
            "Agrobacterium only infects animal cells, not plants."
          ],
          explanation: "Agrobacterium is a natural genetic engineer. It uses the Ti plasmid to insert tumor-inducing T-DNA into plant cells."
        },
        {
          type: "match",
          prompt: "Match the plasmid component to its function in the pBR322 vector:",
          pairs: [
            { left: "AmpR", right: "Ampicillin resistance" },
            { left: "TCR", right: "Tetracycline resistance" },
            { left: "Ori", right: "Origin of replication" }
          ],
          explanation: "The pBR322 plasmid is a classic cloning vector with selectable markers (AmpR, TCR) and an origin of replication (Ori)."
        }
      ]
    },
    {
      id: "c5",
      name: "Synthetic Biology and Epigenetics",
      questions: [
        {
          type: "typed",
          prompt: "Which organism's genome was chemically synthesized (JCVI-syn1.0) and inserted into a recipient cell to create a new self-replicating cell?",
          answer: "Mycoplasma mycoides",
          accept: ["mycoplasma", "mycoplasma mycoides"],
          explanation: "The J. Craig Venter Institute synthesized the genome of Mycoplasma mycoides and transplanted it into a related bacterium, creating the first synthetic life form."
        },
        {
          type: "fill",
          prompt: "In addition to DNA, recent research shows that fragments of tRNA (called ________) in sperm can transfer acquired metabolic disorders to the next generation.",
          answer: "tsRNAs",
          accept: ["tsrnas", "tRNA-derived small RNAs"],
          explanation: "tsRNAs (tRNA-derived small RNAs) are epigenetic factors that can mediate intergenerational inheritance of traits like diet-induced metabolic disorders."
        },
        {
          type: "sequence",
          prompt: "Order the events of *Agrobacterium tumefaciens* natural transformation:",
          steps: [
            "Bacterium attaches to plant wound",
            "T-DNA is transferred from the Ti plasmid to the plant cell",
            "T-DNA integrates into the plant genome",
            "Plant cells proliferate, forming a crown gall tumor"
          ],
          explanation: "The bacterium acts as a syringe, injecting the T-DNA into the plant cell, which then integrates into the genome and causes uncontrolled growth."
        },
        {
          type: "mcq",
          prompt: "What was the major significance of the Gibson et al. (2010) bacterial cell experiment?",
          options: [
            "It proved that RNA can act as an enzyme.",
            "It showed that a completely chemically synthesized genome can control and sustain a living cell.",
            "It discovered the structure of the double helix.",
            "It was the first time a plasmid was used in E. coli."
          ],
          answer: 1,
          explanation: "This experiment proved the 'genetic code' is universal and sufficient for life, creating the first self-replicating synthetic cell."
        },
        {
          type: "tf",
          prompt: "Inheritance of traits is *only* mediated by DNA; RNA cannot transmit acquired characteristics between generations.",
          answer: false,
          reason: "Studies like Chen et al. (2015) show that sperm tsRNAs can mediate intergenerational inheritance of metabolic disorders (like glucose intolerance) without changing the DNA sequence.",
          wrong_reasons: [
            "True: RNA is destroyed during fertilization and cannot affect the offspring.",
            "False: Proteins are the only other molecule that mediates inheritance."
          ],
          explanation: "Epigenetics (like tsRNAs) proves that DNA is not the only molecule of inheritance. Acquired traits can be passed down via RNA."
        },
        {
          type: "match",
          prompt: "Match the molecule to its role in inheritance/transformation:",
          pairs: [
            { left: "T-DNA", right: "Transferred from bacterium to plant" },
            { left: "tsRNA", right: "Transmits metabolic traits in mice" },
            { left: "AmpR", right: "Selectable marker in plasmids" }
          ],
          explanation: "These are all examples of nucleic acids acting as vectors, selectable markers, or epigenetic messengers."
        }
      ]
    },
    {
      id: "c6",
      name: "The *Le* Gene and Gibberellin",
      questions: [
        {
          type: "typed",
          prompt: "What specific enzyme does the *Le* gene encode?",
          answer: "Gibberellin 3β-hydroxylase",
          accept: ["gibberellin 3b-hydroxylase", "gibberellin 3beta-hydroxylase", "ga 3-hydroxylase"],
          explanation: "The *Le* gene encodes the enzyme GA 3β-hydroxylase, which is crucial for synthesizing active gibberellin."
        },
        {
          type: "fill",
          prompt: "The *Le* enzyme converts the inactive GA20 into the active ________.",
          answer: "GA1",
          accept: ["ga1", "ga 1"],
          explanation: "The enzyme adds a hydroxyl group to GA20, converting it into the active form GA1, which promotes stem elongation."
        },
        {
          type: "sequence",
          prompt: "Order the steps of the biochemical pathway affected by the Le mutation:",
          steps: [
            "The *Le* gene encodes GA 3β-hydroxylase",
            "GA20 is converted to active GA1",
            "Plant grows tall"
          ],
          explanation: "Active GA1 is required for stem elongation. The Le enzyme is the critical step in creating this active hormone."
        },
        {
          type: "mcq",
          prompt: "The mutant *le* allele has a specific single base pair change. What is this mutation?",
          options: [
            "A silent mutation with no effect on the protein.",
            "An A to G transition causing an Alanine to Threonine substitution (A229T).",
            "A deletion of the entire gene.",
            "A frameshift mutation that creates a stop codon."
          ],
          answer: 1,
          explanation: "The A229T substitution disrupts the enzyme's active site, severely reducing its ability to hydroxylate GA20."
        },
        {
          type: "tf",
          prompt: "The mutant *le* allele results in a hyperactive enzyme that produces too much active GA1, causing dwarfism.",
          answer: false,
          reason: "The mutant *le* allele results in *very little* GA hydroxylase activity. Because it cannot convert GA20 to active GA1, the plant remains dwarf.",
          wrong_reasons: [
            "True: The mutant allele causes overgrowth.",
            "False: The mutant allele affects root development, not height."
          ],
          explanation: "Because the enzyme is inactive, the plant lacks the active GA1 hormone needed to grow tall, resulting in a dwarf phenotype."
        },
        {
          type: "match",
          prompt: "Match the genotype to its effect on the gibberellin pathway:",
          pairs: [
            { left: "Le (Wild-type)", right: "High GA 3β-hydroxylase activity" },
            { left: "le (Mutant)", right: "Very little GA 3β-hydroxylase activity" }
          ],
          explanation: "The wild-type allele produces a functional enzyme. The mutant allele produces a defective enzyme."
        }
      ]
    }
  ]
};
