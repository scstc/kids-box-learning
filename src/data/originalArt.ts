export type OriginalArt = { file: string; width: number; height: number; source: { kind: "pdf" | "flashcard"; page?: number | string; rect?: number[]; number?: number } };

export const originalCover: OriginalArt = {
  "file": "book-art/cover.webp",
  "width": 676,
  "height": 720,
  "source": {
    "kind": "pdf",
    "page": "cover",
    "rect": [
      0,
      0,
      1502,
      1600
    ]
  }
};

export const originalUnitArt: Record<number, OriginalArt> = {
  "1": {
    "file": "book-art/unit-1.webp",
    "width": 720,
    "height": 598,
    "source": {
      "kind": "pdf",
      "page": 4,
      "rect": [
        40,
        395,
        1180,
        980
      ]
    }
  },
  "2": {
    "file": "book-art/unit-2.webp",
    "width": 720,
    "height": 598,
    "source": {
      "kind": "pdf",
      "page": 10,
      "rect": [
        40,
        395,
        1180,
        980
      ]
    }
  },
  "3": {
    "file": "book-art/unit-3.webp",
    "width": 720,
    "height": 598,
    "source": {
      "kind": "pdf",
      "page": 18,
      "rect": [
        40,
        395,
        1180,
        980
      ]
    }
  },
  "4": {
    "file": "book-art/unit-4.webp",
    "width": 720,
    "height": 598,
    "source": {
      "kind": "pdf",
      "page": 24,
      "rect": [
        40,
        395,
        1180,
        980
      ]
    }
  },
  "5": {
    "file": "book-art/unit-5.webp",
    "width": 720,
    "height": 598,
    "source": {
      "kind": "pdf",
      "page": 34,
      "rect": [
        40,
        395,
        1180,
        980
      ]
    }
  },
  "6": {
    "file": "book-art/unit-6.webp",
    "width": 720,
    "height": 598,
    "source": {
      "kind": "pdf",
      "page": 40,
      "rect": [
        40,
        395,
        1180,
        980
      ]
    }
  },
  "7": {
    "file": "book-art/unit-7.webp",
    "width": 720,
    "height": 598,
    "source": {
      "kind": "pdf",
      "page": 48,
      "rect": [
        40,
        395,
        1180,
        980
      ]
    }
  },
  "8": {
    "file": "book-art/unit-8.webp",
    "width": 720,
    "height": 598,
    "source": {
      "kind": "pdf",
      "page": 54,
      "rect": [
        40,
        395,
        1180,
        980
      ]
    }
  },
  "9": {
    "file": "book-art/unit-9.webp",
    "width": 720,
    "height": 598,
    "source": {
      "kind": "pdf",
      "page": 64,
      "rect": [
        40,
        395,
        1180,
        980
      ]
    }
  },
  "10": {
    "file": "book-art/unit-10.webp",
    "width": 720,
    "height": 598,
    "source": {
      "kind": "pdf",
      "page": 70,
      "rect": [
        40,
        395,
        1180,
        980
      ]
    }
  },
  "11": {
    "file": "book-art/unit-11.webp",
    "width": 720,
    "height": 598,
    "source": {
      "kind": "pdf",
      "page": 78,
      "rect": [
        40,
        395,
        1180,
        980
      ]
    }
  },
  "12": {
    "file": "book-art/unit-12.webp",
    "width": 720,
    "height": 598,
    "source": {
      "kind": "pdf",
      "page": 84,
      "rect": [
        40,
        395,
        1180,
        980
      ]
    }
  }
};

export const originalWordArt: Record<string, OriginalArt> = {
  "1:red": {
    "file": "book-art/card-039.webp",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 39
    }
  },
  "1:yellow": {
    "file": "book-art/card-041.webp",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 41
    }
  },
  "1:pink": {
    "file": "book-art/card-043.webp",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 43
    }
  },
  "1:green": {
    "file": "book-art/card-045.webp",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 45
    }
  },
  "1:orange": {
    "file": "book-art/card-047.webp",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 47
    }
  },
  "1:purple": {
    "file": "book-art/card-049.webp",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 49
    }
  },
  "1:blue": {
    "file": "book-art/card-051.webp",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 51
    }
  },
  "1:one": {
    "file": "book-art/card-017.webp",
    "width": 128,
    "height": 471,
    "source": {
      "kind": "flashcard",
      "number": 17
    }
  },
  "1:two": {
    "file": "book-art/card-019.webp",
    "width": 322,
    "height": 477,
    "source": {
      "kind": "flashcard",
      "number": 19
    }
  },
  "1:three": {
    "file": "book-art/card-021.webp",
    "width": 295,
    "height": 483,
    "source": {
      "kind": "flashcard",
      "number": 21
    }
  },
  "1:four": {
    "file": "book-art/card-023.webp",
    "width": 330,
    "height": 477,
    "source": {
      "kind": "flashcard",
      "number": 23
    }
  },
  "1:five": {
    "file": "book-art/card-025.webp",
    "width": 296,
    "height": 477,
    "source": {
      "kind": "flashcard",
      "number": 25
    }
  },
  "1:six": {
    "file": "book-art/card-027.webp",
    "width": 322,
    "height": 483,
    "source": {
      "kind": "flashcard",
      "number": 27
    }
  },
  "1:seven": {
    "file": "book-art/card-029.webp",
    "width": 324,
    "height": 477,
    "source": {
      "kind": "flashcard",
      "number": 29
    }
  },
  "1:eight": {
    "file": "book-art/card-031.webp",
    "width": 325,
    "height": 482,
    "source": {
      "kind": "flashcard",
      "number": 31
    }
  },
  "1:nine": {
    "file": "book-art/card-033.webp",
    "width": 322,
    "height": 483,
    "source": {
      "kind": "flashcard",
      "number": 33
    }
  },
  "1:ten": {
    "file": "book-art/card-035.webp",
    "width": 476,
    "height": 483,
    "source": {
      "kind": "flashcard",
      "number": 35
    }
  },
  "2:book": {
    "file": "book-art/card-055.webp",
    "width": 476,
    "height": 409,
    "source": {
      "kind": "flashcard",
      "number": 55
    }
  },
  "2:chair": {
    "file": "book-art/card-057.webp",
    "width": 400,
    "height": 580,
    "source": {
      "kind": "flashcard",
      "number": 57
    }
  },
  "2:table": {
    "file": "book-art/card-053.webp",
    "width": 476,
    "height": 353,
    "source": {
      "kind": "flashcard",
      "number": 53
    }
  },
  "2:pen": {
    "file": "book-art/card-061.webp",
    "width": 435,
    "height": 492,
    "source": {
      "kind": "flashcard",
      "number": 61
    }
  },
  "2:pencil": {
    "file": "book-art/card-063.webp",
    "width": 444,
    "height": 578,
    "source": {
      "kind": "flashcard",
      "number": 63
    }
  },
  "2:eraser": {
    "file": "book-art/card-059.webp",
    "width": 461,
    "height": 313,
    "source": {
      "kind": "flashcard",
      "number": 59
    }
  },
  "2:bag": {
    "file": "book-art/word-2-bag.webp",
    "width": 305,
    "height": 280,
    "source": {
      "kind": "pdf",
      "page": 10,
      "rect": [
        570,
        700,
        305,
        280
      ]
    }
  },
  "2:school": {
    "file": "book-art/word-2-school.webp",
    "width": 720,
    "height": 320,
    "source": {
      "kind": "pdf",
      "page": 11,
      "rect": [
        165,
        335,
        935,
        415
      ]
    }
  },
  "3:ball": {
    "file": "book-art/card-071.webp",
    "width": 393,
    "height": 385,
    "source": {
      "kind": "flashcard",
      "number": 71
    }
  },
  "3:bike": {
    "file": "book-art/card-077.webp",
    "width": 480,
    "height": 442,
    "source": {
      "kind": "flashcard",
      "number": 77
    }
  },
  "3:car": {
    "file": "book-art/card-069.webp",
    "width": 493,
    "height": 513,
    "source": {
      "kind": "flashcard",
      "number": 69
    }
  },
  "3:doll": {
    "file": "book-art/word-3-doll.webp",
    "width": 140,
    "height": 214,
    "source": {
      "kind": "pdf",
      "page": 18,
      "rect": [
        947,
        411,
        140,
        214
      ]
    }
  },
  "3:train": {
    "file": "book-art/card-079.webp",
    "width": 480,
    "height": 340,
    "source": {
      "kind": "flashcard",
      "number": 79
    }
  },
  "3:computer": {
    "file": "book-art/card-075.webp",
    "width": 471,
    "height": 584,
    "source": {
      "kind": "flashcard",
      "number": 75
    }
  },
  "3:black": {
    "file": "book-art/card-081.webp",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 81
    }
  },
  "3:white": {
    "file": "book-art/card-085.webp",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 85
    }
  },
  "3:brown": {
    "file": "book-art/card-083.webp",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 83
    }
  },
  "3:grey": {
    "file": "book-art/card-087.webp",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 87
    }
  },
  "4:mother": {
    "file": "book-art/card-007.webp",
    "width": 244,
    "height": 624,
    "source": {
      "kind": "flashcard",
      "number": 7
    }
  },
  "4:father": {
    "file": "book-art/card-009.webp",
    "width": 252,
    "height": 624,
    "source": {
      "kind": "flashcard",
      "number": 9
    }
  },
  "4:brother": {
    "file": "book-art/card-003.webp",
    "width": 296,
    "height": 599,
    "source": {
      "kind": "flashcard",
      "number": 3
    }
  },
  "4:sister": {
    "file": "book-art/card-005.webp",
    "width": 268,
    "height": 624,
    "source": {
      "kind": "flashcard",
      "number": 5
    }
  },
  "4:grandmother": {
    "file": "book-art/card-089.webp",
    "width": 535,
    "height": 570,
    "source": {
      "kind": "flashcard",
      "number": 89
    }
  },
  "4:grandfather": {
    "file": "book-art/card-091.webp",
    "width": 234,
    "height": 624,
    "source": {
      "kind": "flashcard",
      "number": 91
    }
  },
  "4:family": {
    "file": "book-art/word-4-family.webp",
    "width": 720,
    "height": 352,
    "source": {
      "kind": "pdf",
      "page": 24,
      "rect": [
        70,
        562,
        1120,
        548
      ]
    }
  },
  "4:happy": {
    "file": "book-art/word-4-happy.webp",
    "width": 171,
    "height": 195,
    "source": {
      "kind": "pdf",
      "page": 26,
      "rect": [
        518,
        805,
        171,
        195
      ]
    }
  },
  "4:sad": {
    "file": "book-art/word-4-sad.webp",
    "width": 138,
    "height": 198,
    "source": {
      "kind": "pdf",
      "page": 26,
      "rect": [
        808,
        420,
        138,
        198
      ]
    }
  },
  "5:cat": {
    "file": "book-art/card-093.webp",
    "width": 416,
    "height": 455,
    "source": {
      "kind": "flashcard",
      "number": 93
    }
  },
  "5:dog": {
    "file": "book-art/card-095.webp",
    "width": 396,
    "height": 624,
    "source": {
      "kind": "flashcard",
      "number": 95
    }
  },
  "5:bird": {
    "file": "book-art/card-103.webp",
    "width": 443,
    "height": 624,
    "source": {
      "kind": "flashcard",
      "number": 103
    }
  },
  "5:fish": {
    "file": "book-art/card-097.webp",
    "width": 430,
    "height": 541,
    "source": {
      "kind": "flashcard",
      "number": 97
    }
  },
  "5:horse": {
    "file": "book-art/card-099.webp",
    "width": 432,
    "height": 599,
    "source": {
      "kind": "flashcard",
      "number": 99
    }
  },
  "5:mouse": {
    "file": "book-art/card-101.webp",
    "width": 446,
    "height": 494,
    "source": {
      "kind": "flashcard",
      "number": 101
    }
  },
  "6:face": {
    "file": "book-art/card-105.webp",
    "width": 482,
    "height": 468,
    "source": {
      "kind": "flashcard",
      "number": 105
    }
  },
  "6:eye": {
    "file": "book-art/card-109.webp",
    "width": 481,
    "height": 482,
    "source": {
      "kind": "flashcard",
      "number": 109
    }
  },
  "6:ear": {
    "file": "book-art/word-6-ear.webp",
    "width": 112,
    "height": 176,
    "source": {
      "kind": "pdf",
      "page": 40,
      "rect": [
        434,
        445,
        112,
        176
      ]
    }
  },
  "6:nose": {
    "file": "book-art/card-113.webp",
    "width": 482,
    "height": 486,
    "source": {
      "kind": "flashcard",
      "number": 113
    }
  },
  "6:mouth": {
    "file": "book-art/card-111.webp",
    "width": 486,
    "height": 484,
    "source": {
      "kind": "flashcard",
      "number": 111
    }
  },
  "6:hair": {
    "file": "book-art/word-6-hair.webp",
    "width": 244,
    "height": 95,
    "source": {
      "kind": "pdf",
      "page": 40,
      "rect": [
        504,
        440,
        244,
        95
      ]
    }
  },
  "6:head": {
    "file": "book-art/word-6-head.webp",
    "width": 350,
    "height": 267,
    "source": {
      "kind": "pdf",
      "page": 40,
      "rect": [
        438,
        440,
        350,
        267
      ]
    }
  },
  "6:tooth": {
    "file": "book-art/card-115.webp",
    "width": 485,
    "height": 483,
    "source": {
      "kind": "flashcard",
      "number": 115
    }
  },
  "6:hand": {
    "file": "book-art/word-6-hand.webp",
    "width": 125,
    "height": 155,
    "source": {
      "kind": "pdf",
      "page": 40,
      "rect": [
        764,
        535,
        125,
        155
      ]
    }
  },
  "6:foot": {
    "file": "book-art/word-6-foot.webp",
    "width": 160,
    "height": 105,
    "source": {
      "kind": "pdf",
      "page": 40,
      "rect": [
        415,
        791,
        160,
        105
      ]
    }
  },
  "7:giraffe": {
    "file": "book-art/card-123.webp",
    "width": 415,
    "height": 624,
    "source": {
      "kind": "flashcard",
      "number": 123
    }
  },
  "7:elephant": {
    "file": "book-art/card-119.webp",
    "width": 522,
    "height": 532,
    "source": {
      "kind": "flashcard",
      "number": 119
    }
  },
  "7:snake": {
    "file": "book-art/card-125.webp",
    "width": 483,
    "height": 599,
    "source": {
      "kind": "flashcard",
      "number": 125
    }
  },
  "7:hippo": {
    "file": "book-art/card-121.webp",
    "width": 443,
    "height": 451,
    "source": {
      "kind": "flashcard",
      "number": 121
    }
  },
  "7:crocodile": {
    "file": "book-art/card-117.webp",
    "width": 520,
    "height": 582,
    "source": {
      "kind": "flashcard",
      "number": 117
    }
  },
  "7:monkey": {
    "file": "book-art/card-129.webp",
    "width": 493,
    "height": 609,
    "source": {
      "kind": "flashcard",
      "number": 129
    }
  },
  "7:tiger": {
    "file": "book-art/card-127.webp",
    "width": 516,
    "height": 572,
    "source": {
      "kind": "flashcard",
      "number": 127
    }
  },
  "7:tail": {
    "file": "book-art/word-7-tail.webp",
    "width": 139,
    "height": 141,
    "source": {
      "kind": "pdf",
      "page": 50,
      "rect": [
        990,
        688,
        139,
        141
      ]
    }
  },
  "7:leg": {
    "file": "book-art/word-7-leg.webp",
    "width": 155,
    "height": 300,
    "source": {
      "kind": "pdf",
      "page": 65,
      "rect": [
        500,
        1020,
        155,
        300
      ]
    }
  },
  "7:body": {
    "file": "book-art/card-107.webp",
    "width": 479,
    "height": 478,
    "source": {
      "kind": "flashcard",
      "number": 107
    }
  },
  "8:shirt": {
    "file": "book-art/word-8-shirt.webp",
    "width": 166,
    "height": 170,
    "source": {
      "kind": "pdf",
      "page": 54,
      "rect": [
        1047,
        1000,
        166,
        170
      ]
    }
  },
  "8:t-shirt": {
    "file": "book-art/card-141.webp",
    "width": 484,
    "height": 483,
    "source": {
      "kind": "flashcard",
      "number": 141
    }
  },
  "8:skirt": {
    "file": "book-art/card-135.webp",
    "width": 499,
    "height": 388,
    "source": {
      "kind": "flashcard",
      "number": 135
    }
  },
  "8:trousers": {
    "file": "book-art/card-139.webp",
    "width": 300,
    "height": 587,
    "source": {
      "kind": "flashcard",
      "number": 139
    }
  },
  "8:shoes": {
    "file": "book-art/card-133.webp",
    "width": 454,
    "height": 462,
    "source": {
      "kind": "flashcard",
      "number": 133
    }
  },
  "8:socks": {
    "file": "book-art/card-137.webp",
    "width": 462,
    "height": 468,
    "source": {
      "kind": "flashcard",
      "number": 137
    }
  },
  "8:jacket": {
    "file": "book-art/card-131.webp",
    "width": 509,
    "height": 564,
    "source": {
      "kind": "flashcard",
      "number": 131
    }
  },
  "9:swim": {
    "file": "book-art/card-153.webp",
    "width": 529,
    "height": 484,
    "source": {
      "kind": "flashcard",
      "number": 153
    }
  },
  "9:sing": {
    "file": "book-art/word-9-sing.webp",
    "width": 111,
    "height": 96,
    "source": {
      "kind": "pdf",
      "page": 67,
      "rect": [
        536,
        530,
        111,
        96
      ]
    }
  },
  "9:ride": {
    "file": "book-art/card-155.webp",
    "width": 482,
    "height": 568,
    "source": {
      "kind": "flashcard",
      "number": 155
    }
  },
  "9:football": {
    "file": "book-art/card-143.webp",
    "width": 488,
    "height": 606,
    "source": {
      "kind": "flashcard",
      "number": 143
    }
  },
  "9:tennis": {
    "file": "book-art/card-147.webp",
    "width": 473,
    "height": 624,
    "source": {
      "kind": "flashcard",
      "number": 147
    }
  },
  "9:basketball": {
    "file": "book-art/card-145.webp",
    "width": 457,
    "height": 624,
    "source": {
      "kind": "flashcard",
      "number": 145
    }
  },
  "10:bus": {
    "file": "book-art/card-157.webp",
    "width": 505,
    "height": 400,
    "source": {
      "kind": "flashcard",
      "number": 157
    }
  },
  "10:boat": {
    "file": "book-art/card-167.webp",
    "width": 449,
    "height": 608,
    "source": {
      "kind": "flashcard",
      "number": 167
    }
  },
  "10:plane": {
    "file": "book-art/card-165.webp",
    "width": 479,
    "height": 466,
    "source": {
      "kind": "flashcard",
      "number": 165
    }
  },
  "10:helicopter": {
    "file": "book-art/card-163.webp",
    "width": 447,
    "height": 541,
    "source": {
      "kind": "flashcard",
      "number": 163
    }
  },
  "10:lorry": {
    "file": "book-art/card-159.webp",
    "width": 486,
    "height": 470,
    "source": {
      "kind": "flashcard",
      "number": 159
    }
  },
  "10:motorbike": {
    "file": "book-art/card-161.webp",
    "width": 487,
    "height": 377,
    "source": {
      "kind": "flashcard",
      "number": 161
    }
  },
  "11:house": {
    "file": "book-art/word-11-house.webp",
    "width": 705,
    "height": 610,
    "source": {
      "kind": "pdf",
      "page": 26,
      "rect": [
        25,
        205,
        705,
        610
      ]
    }
  },
  "11:living-room": {
    "file": "book-art/card-179.webp",
    "width": 439,
    "height": 624,
    "source": {
      "kind": "flashcard",
      "number": 179
    }
  },
  "11:bedroom": {
    "file": "book-art/card-171.webp",
    "width": 493,
    "height": 602,
    "source": {
      "kind": "flashcard",
      "number": 171
    }
  },
  "11:bathroom": {
    "file": "book-art/card-169.webp",
    "width": 514,
    "height": 512,
    "source": {
      "kind": "flashcard",
      "number": 169
    }
  },
  "11:kitchen": {
    "file": "book-art/card-177.webp",
    "width": 448,
    "height": 624,
    "source": {
      "kind": "flashcard",
      "number": 177
    }
  },
  "11:door": {
    "file": "book-art/word-11-door.webp",
    "width": 225,
    "height": 195,
    "source": {
      "kind": "pdf",
      "page": 78,
      "rect": [
        674,
        1075,
        225,
        195
      ]
    }
  },
  "11:window": {
    "file": "book-art/word-11-window.webp",
    "width": 139,
    "height": 220,
    "source": {
      "kind": "pdf",
      "page": 26,
      "rect": [
        779,
        162,
        139,
        220
      ]
    }
  },
  "12:apple": {
    "file": "book-art/card-181.webp",
    "width": 437,
    "height": 426,
    "source": {
      "kind": "flashcard",
      "number": 181
    }
  },
  "12:banana": {
    "file": "book-art/card-183.webp",
    "width": 455,
    "height": 545,
    "source": {
      "kind": "flashcard",
      "number": 183
    }
  },
  "12:orange": {
    "file": "book-art/word-12-orange.webp",
    "width": 118,
    "height": 91,
    "source": {
      "kind": "pdf",
      "page": 84,
      "rect": [
        420,
        890,
        118,
        91
      ]
    }
  },
  "12:pear": {
    "file": "book-art/word-12-pear.webp",
    "width": 96,
    "height": 143,
    "source": {
      "kind": "pdf",
      "page": 90,
      "rect": [
        324,
        939,
        96,
        143
      ]
    }
  },
  "12:cake": {
    "file": "book-art/card-187.webp",
    "width": 440,
    "height": 471,
    "source": {
      "kind": "flashcard",
      "number": 187
    }
  },
  "12:chocolate": {
    "file": "book-art/card-189.webp",
    "width": 528,
    "height": 504,
    "source": {
      "kind": "flashcard",
      "number": 189
    }
  },
  "12:ice-cream": {
    "file": "book-art/card-191.webp",
    "width": 368,
    "height": 624,
    "source": {
      "kind": "flashcard",
      "number": 191
    }
  },
  "12:party": {
    "file": "book-art/word-12-party.webp",
    "width": 720,
    "height": 610,
    "source": {
      "kind": "pdf",
      "page": 84,
      "rect": [
        38,
        375,
        1180,
        1000
      ]
    }
  },
  "5:big": {
    "file": "book-art/word-5-big.webp",
    "width": 600,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 57
    }
  },
  "5:small": {
    "file": "book-art/word-5-small.webp",
    "width": 600,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 57
    }
  },
  "5:long": {
    "file": "book-art/word-5-long.webp",
    "width": 600,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 63,
      "page": 36,
      "rect": [
        691,
        1128,
        74,
        60
      ]
    }
  },
  "5:short": {
    "file": "book-art/word-5-short.webp",
    "width": 600,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 63,
      "page": 36,
      "rect": [
        691,
        1128,
        74,
        60
      ]
    }
  }
};

export const wordArtFallbacks = [
  {
    "unitId": 1,
    "id": "hello",
    "zh": "你好"
  },
  {
    "unitId": 1,
    "id": "goodbye",
    "zh": "再见"
  },
  {
    "unitId": 4,
    "id": "baby",
    "zh": "宝宝"
  },
  {
    "unitId": 8,
    "id": "dress",
    "zh": "连衣裙"
  },
  {
    "unitId": 9,
    "id": "play",
    "zh": "玩耍"
  },
  {
    "unitId": 9,
    "id": "run",
    "zh": "跑"
  },
  {
    "unitId": 9,
    "id": "jump",
    "zh": "跳"
  },
  {
    "unitId": 9,
    "id": "dance",
    "zh": "跳舞"
  },
  {
    "unitId": 10,
    "id": "funny",
    "zh": "有趣的"
  },
  {
    "unitId": 10,
    "id": "hungry",
    "zh": "饿的"
  },
  {
    "unitId": 11,
    "id": "garden",
    "zh": "花园"
  }
];
