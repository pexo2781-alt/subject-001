export const chemistryLecture1 = {
  id: "chem-lecture-1",
  title: "Chem L1: Atomic Structure",
  concepts: [
    {
      id: "cc1",
      name: "Subatomic Particles and Atomic Structure",
      questions: [
        {
          type: "typed",
          prompt: "Name the three subatomic particles that make up an atom.",
          answer: "protons, neutrons, electrons",
          accept: [
            "proton neutron electron",
            "protons neutrons electrons",
            "electrons protons neutrons",
            "protons electrons neutrons",
            "neutrons protons electrons"
          ],
          explanation: "Atoms consist of positively charged protons, neutral neutrons, and negatively charged electrons. Protons and neutrons form the nucleus; electrons orbit in shells around it."
        },
        {
          type: "fill",
          prompt: "Protons and neutrons are found in the centre of the atom, forming the ________.",
          answer: "nucleus",
          explanation: "The nucleus is the dense central core of the atom, containing the protons and neutrons. Nearly all of an atom's mass is concentrated here."
        },
        {
          type: "sequence",
          prompt: "Order these subatomic particles by their relative mass, from smallest to largest:",
          steps: [
            "Electron (negligible mass)",
            "Proton (mass = 1)",
            "Neutron (mass = 1)"
          ],
          explanation: "Electrons have negligible mass compared to protons and neutrons. Protons and neutrons each have a relative mass of approximately 1 atomic mass unit (amu); the electron's mass is roughly 1/1836 of that."
        },
        {
          type: "mcq",
          prompt: "Which statement correctly describes the charges of the subatomic particles?",
          options: [
            "Protons are negative, electrons are positive, neutrons are neutral.",
            "Protons are positive, electrons are negative, neutrons are neutral.",
            "Protons are neutral, electrons are negative, neutrons are positive.",
            "All three particles are positively charged."
          ],
          answer: 1,
          explanation: "Protons carry a positive charge, electrons carry a negative charge, and neutrons carry no charge. In a neutral atom, the number of protons equals the number of electrons."
        },
        {
          type: "tf",
          prompt: "Electrons orbit the nucleus in shells, and they have a mass approximately equal to that of a proton.",
          answer: false,
          reason: "Electrons do orbit the nucleus in shells, but their mass is negligible — roughly 1/1836 the mass of a proton. Almost all of an atom's mass comes from the nucleus.",
          wrong_reasons: [
            "True: electrons and protons have the same mass.",
            "False: electrons are found inside the nucleus."
          ],
          explanation: "Electrons have negligible mass compared with protons and neutrons. The near-equality of proton and neutron mass, and the tiny mass of the electron, explains why mass number only counts protons and neutrons."
        },
        {
          type: "match",
          prompt: "Match each subatomic particle to its location and charge:",
          pairs: [
            { left: "Proton", right: "Nucleus, positive" },
            { left: "Neutron", right: "Nucleus, neutral" },
            { left: "Electron", right: "Shells, negative" }
          ],
          explanation: "Protons and neutrons are in the nucleus (positive and neutral respectively); electrons occupy shells around the nucleus and are negatively charged."
        }
      ]
    },
    {
      id: "cc2",
      name: "Atomic Number and Mass Number",
      questions: [
        {
          type: "typed",
          prompt: "What is the atomic number of an element defined as?",
          answer: "number of protons",
          accept: [
            "number of protons",
            "the number of protons",
            "protons",
            "proton count",
            "# of protons"
          ],
          explanation: "The atomic number (Z) is the number of protons in the nucleus. It uniquely defines the element — change the proton count and you have a different element."
        },
        {
          type: "fill",
          prompt: "The mass number of an atom is calculated as the number of protons plus the number of ________.",
          answer: "neutrons",
          explanation: "Mass number (A) = protons + neutrons. Electrons are not counted because their mass is negligible. This is why it approximates relative atomic mass."
        },
        {
          type: "sequence",
          prompt: "For a neutral helium atom (He, atomic number 2, mass number 4), order the following counts from lowest to highest:",
          steps: [
            "Number of electrons (2)",
            "Number of protons (2)",
            "Number of neutrons (2)",
            "Mass number (4)"
          ],
          explanation: "For helium-4: 2 protons, 2 electrons (neutral atom), 2 neutrons. Mass number = 2 + 2 = 4."
        },
        {
          type: "mcq",
          prompt: "An atom of sodium (Na) has an atomic number of 11 and a mass number of 23. How many neutrons does it have?",
          options: [
            "11",
            "12",
            "23",
            "34"
          ],
          answer: 1,
          explanation: "Neutrons = mass number − atomic number = 23 − 11 = 12. Sodium-23 has 11 protons, 12 neutrons, and 11 electrons in its neutral form."
        },
        {
          type: "tf",
          prompt: "In a neutral atom, the number of electrons always equals the number of protons.",
          answer: true,
          reason: "A neutral atom has no net charge, so the number of negative electrons must equal the number of positive protons. Lose or gain electrons and it becomes an ion.",
          wrong_reasons: [
            "False: electrons always outnumber protons.",
            "False: in a neutral atom, electrons equal neutrons."
          ],
          explanation: "Neutral atoms are electrically balanced: # electrons = # protons. Ions form when this balance is disrupted (electrons are gained or lost)."
        },
        {
          type: "match",
          prompt: "Match the quantity to its definition:",
          pairs: [
            { left: "Atomic number", right: "Number of protons" },
            { left: "Mass number", right: "Protons + neutrons" },
            { left: "Neutron number", right: "Mass number − atomic number" }
          ],
          explanation: "These three numbers are linked: A = Z + N. Knowing any two lets you calculate the third."
        }
      ]
    },
    {
      id: "cc3",
      name: "Isotopes",
      questions: [
        {
          type: "typed",
          prompt: "What are atoms of the same element with different numbers of neutrons called?",
          answer: "isotopes",
          accept: ["isotopes", "isotope"],
          explanation: "Isotopes are atoms of the same element (same proton count) with different neutron counts, and therefore different mass numbers."
        },
        {
          type: "fill",
          prompt: "Carbon has three naturally occurring isotopes: carbon-12, carbon-13, and carbon-________.",
          answer: "14",
          explanation: "Carbon has three main isotopes: carbon-12 (6p, 6n), carbon-13 (6p, 7n), and carbon-14 (6p, 8n, trace amount, radioactive)."
        },
        {
          type: "sequence",
          prompt: "Order the three carbon isotopes by their natural abundance, from most abundant to least abundant:",
          steps: [
            "Carbon-12 (98.9%)",
            "Carbon-13 (1.1%)",
            "Carbon-14 (<0.1%)"
          ],
          explanation: "Carbon-12 makes up 98.9% of natural carbon; carbon-13 makes up 1.1%; carbon-14 is less than 0.1% (and is radioactive)."
        },
        {
          type: "mcq",
          prompt: "Carbon-13 has 6 protons. How many neutrons does it have?",
          options: [
            "6",
            "7",
            "13",
            "19"
          ],
          answer: 1,
          explanation: "Neutrons = mass number − atomic number = 13 − 6 = 7. Carbon-13 has 6 protons, 7 neutrons, and 6 electrons."
        },
        {
          type: "tf",
          prompt: "Isotopes of the same element have different chemical properties because they have different numbers of electrons.",
          answer: false,
          reason: "Isotopes of the same element have the *same* number of electrons (same proton count = same neutral electron count), so their chemistry is essentially identical. They differ only in the number of neutrons (and hence mass).",
          wrong_reasons: [
            "True: isotopes have different numbers of electrons.",
            "False: isotopes have different numbers of protons."
          ],
          explanation: "Chemistry is driven by electrons, and isotopes of an element have identical electron configurations. Differences between isotopes are in nuclear mass, not chemical reactivity."
        },
        {
          type: "match",
          prompt: "Match each carbon isotope to its proton/neutron count:",
          pairs: [
            { left: "Carbon-12", right: "6 protons, 6 neutrons" },
            { left: "Carbon-13", right: "6 protons, 7 neutrons" },
            { left: "Carbon-14", right: "6 protons, 8 neutrons" }
          ],
          explanation: "All carbon isotopes have 6 protons (that is what makes them carbon). The mass number increases by 1 as each neutron is added."
        }
      ]
    },
    {
      id: "cc4",
      name: "Relative Atomic Mass",
      questions: [
        {
          type: "typed",
          prompt: "What is the relative atomic mass (RAM) of carbon, to three decimal places?",
          answer: "12.011",
          accept: ["12.011", "12.01", "12.011", "12.011 amu"],
          explanation: "The RAM of carbon is calculated from its isotope abundances: (0.989 × 12) + (0.011 × 13) = 12.011. Carbon-14's <0.1% contribution is negligible."
        },
        {
          type: "fill",
          prompt: "The relative atomic mass of an element is a weighted average of the masses of its ________, taking into account their natural abundances.",
          answer: "isotopes",
          explanation: "RAM = Σ (isotope mass × fractional abundance). It is a weighted average, not the mass of any single atom."
        },
        {
          type: "sequence",
          prompt: "Order the steps to calculate the relative atomic mass of carbon from its isotope data:",
          steps: [
            "Identify the isotope masses (12, 13, 14)",
            "Identify the fractional abundances (0.989, 0.011, <0.001)",
            "Multiply each mass by its abundance",
            "Sum the products to get the RAM"
          ],
          explanation: "RAM = Σ(mass × abundance). For carbon: (0.989 × 12) + (0.011 × 13) + (negligible × 14) = 12.011."
        },
        {
          type: "mcq",
          prompt: "Using carbon's isotopic data — carbon-12 (98.9%) and carbon-13 (1.1%) — what is the RAM of carbon?",
          options: [
            "12.000",
            "12.011",
            "12.500",
            "13.000"
          ],
          answer: 1,
          explanation: "RAM = (0.989 × 12) + (0.011 × 13) = 11.868 + 0.143 = 12.011. This is why the periodic table lists carbon as 12.011, not 12."
        },
        {
          type: "tf",
          prompt: "The relative atomic mass of an element is always a whole number.",
          answer: false,
          reason: "RAM is a weighted average across isotopes, so it is usually not a whole number. Carbon's RAM is 12.011; chlorine's is ~35.45.",
          wrong_reasons: [
            "True: RAM is always a whole number because masses are integer.",
            "False: RAM is always less than the atomic number."
          ],
          explanation: "Only if an element has a single stable isotope would RAM be near an integer. For most elements, the isotope mix produces a fractional value."
        },
        {
          type: "match",
          prompt: "Match each term to its definition:",
          pairs: [
            { left: "Mass number", right: "Protons + neutrons in one atom" },
            { left: "Relative atomic mass", right: "Weighted average across isotopes" },
            { left: "Atomic number", right: "Number of protons" }
          ],
          explanation: "Mass number is a whole-number count for a single atom; RAM is a weighted average across all isotopes of the element. Atomic number defines the element."
        }
      ]
    },
    {
      id: "cc5",
      name: "Electron Shells and Orbitals",
      questions: [
        {
          type: "typed",
          prompt: "How many electrons can a single orbital hold?",
          answer: "2",
          accept: ["2", "two", "2 electrons"],
          explanation: "Each orbital can hold a maximum of 2 electrons. These two electrons must have opposite spins."
        },
        {
          type: "fill",
          prompt: "The first electron shell contains only one s-orbital, so it can hold a maximum of ________ electrons.",
          answer: "2",
          accept: ["2", "two"],
          explanation: "The first shell (n=1) has only the 1s orbital, which holds 2 electrons. The s-orbital has a spherical shape."
        },
        {
          type: "sequence",
          prompt: "Order the electron shells by the number of electrons they can hold, from smallest to largest:",
          steps: [
            "First shell (2 electrons)",
            "Second shell (8 electrons)",
            "Third shell (18 electrons)"
          ],
          explanation: "Shell 1 = 2 electrons (1 s-orbital). Shell 2 = 8 electrons (1 s + 3 p). Shell 3 = 18 electrons (1 s + 3 p + 5 d)."
        },
        {
          type: "mcq",
          prompt: "The second electron shell consists of how many orbitals, and how many electrons can it hold?",
          options: [
            "1 orbital, 2 electrons",
            "3 orbitals, 6 electrons",
            "4 orbitals, 8 electrons",
            "9 orbitals, 18 electrons"
          ],
          answer: 2,
          explanation: "The second shell contains 4 orbitals total: 1 s-orbital + 3 p-orbitals. At 2 electrons per orbital, that gives a capacity of 8 electrons."
        },
        {
          type: "tf",
          prompt: "The third electron shell contains one s-orbital, three p-orbitals, and five d-orbitals, giving it a capacity of 18 electrons.",
          answer: true,
          reason: "Shell 3 = 1 s + 3 p + 5 d = 9 orbitals × 2 electrons/orbital = 18 electrons total.",
          wrong_reasons: [
            "False: the third shell contains only s and p orbitals.",
            "False: the third shell can only hold 8 electrons."
          ],
          explanation: "The third shell adds the five d-orbitals to the s and p orbitals, giving 9 orbitals and 18 electrons. Each orbital always holds 2 electrons."
        },
        {
          type: "match",
          prompt: "Match each shell to its electron capacity:",
          pairs: [
            { left: "1st shell", right: "2 electrons" },
            { left: "2nd shell", right: "8 electrons" },
            { left: "3rd shell", right: "18 electrons" }
          ],
          explanation: "Shell n has n² orbitals, and 2n² electrons. Shell 1: 2, shell 2: 8, shell 3: 18."
        }
      ]
    },
    {
      id: "cc6",
      name: "Electron Configuration and the Periodic Table",
      questions: [
        {
          type: "typed",
          prompt: "Write the electron configuration of neon (Ne, atomic number 10) using the s/p notation without spaces.",
          answer: "1s2 2s2 2p6",
          accept: ["1s2 2s2 2p6", "1s2 2s2 2p6", "1s2 2s2 2p6", "1s2 2s2 2p6", "1s2 2s2 2p6"],
          explanation: "Neon has 10 electrons: 2 fill the 1s orbital, 2 fill the 2s orbital, and 6 fill the three 2p orbitals. Configuration: 1s² 2s² 2p⁶."
        },
        {
          type: "fill",
          prompt: "In electron-configuration shorthand, bromine (atomic number 35) is written as [________]4s²3d¹⁰4p⁵, referring to the nearest preceding noble gas.",
          answer: "Ar",
          accept: ["ar", "argon", "[Ar]"],
          explanation: "Bromine's full configuration is 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁵. The inner core matches argon, so it is shortened to [Ar]4s²3d¹⁰4p⁵."
        },
        {
          type: "sequence",
          prompt: "Order the orbitals in the order they are filled according to the aufbau principle:",
          steps: [
            "1s",
            "2s",
            "2p",
            "3s",
            "3p",
            "4s",
            "3d",
            "4p"
          ],
          explanation: "Orbitals fill in order of increasing energy: 1s < 2s < 2p < 3s < 3p < 4s < 3d < 4p. Note that 4s fills before 3d (the 4s orbital has lower energy)."
        },
        {
          type: "mcq",
          prompt: "Which statement best explains why the periodic table has its specific shape?",
          options: [
            "Elements are arranged alphabetically by name.",
            "Elements are grouped by atomic mass in a simple ascending order.",
            "Elements are arranged by increasing atomic number, so that electrons fill orbitals in the same order each period.",
            "Elements are grouped randomly into blocks for aesthetic reasons."
          ],
          answer: 2,
          explanation: "The periodic table is organised by increasing atomic number (proton count). As you cross a period, electrons fill the s, p, d, f orbitals in a consistent aufbau order, giving the s-block, p-block, d-block, and f-block structure."
        },
        {
          type: "tf",
          prompt: "In a p-subshell, electrons pair up in the first p-orbital before occupying the other two, because electrons attract one another.",
          answer: false,
          reason: "Electrons repel each other, so they half-fill each p-orbital first (Hund's rule). Pairing only occurs once all three p-orbitals hold one electron each, and paired electrons have opposite spins.",
          wrong_reasons: [
            "True: electrons pair up first because they attract each other.",
            "False: p-orbitals can only hold one electron in total."
          ],
          explanation: "Electrons repel, so they occupy degenerate orbitals singly first (Hund's rule), keeping spins parallel. Pairing happens only after each orbital has one electron. This produces the paramagnetism of half-filled shells."
        },
        {
          type: "match",
          prompt: "Match each region of the periodic table to the subshell it corresponds to:",
          pairs: [
            { left: "Groups 1–2 (left)", right: "s-block" },
            { left: "Groups 13–18 (right)", right: "p-block" },
            { left: "Groups 3–12 (middle)", right: "d-block" },
            { left: "Lanthanides/actinides (bottom)", right: "f-block" }
          ],
          explanation: "The block structure of the periodic table directly reflects which subshell is being filled: groups 1–2 fill s, groups 13–18 fill p, transition metals (3–12) fill d, and the lanthanides/actinides fill f."
        }
      ]
    }
  ]
};
