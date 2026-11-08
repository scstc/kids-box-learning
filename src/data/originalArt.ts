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
    "file": "book-art/card-039.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 39
    }
  },
  "1:yellow": {
    "file": "book-art/card-041.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 41
    }
  },
  "1:pink": {
    "file": "book-art/card-043.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 43
    }
  },
  "1:green": {
    "file": "book-art/card-045.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 45
    }
  },
  "1:orange": {
    "file": "book-art/card-047.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 47
    }
  },
  "1:purple": {
    "file": "book-art/card-049.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 49
    }
  },
  "1:blue": {
    "file": "book-art/card-051.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 51
    }
  },
  "1:one": {
    "file": "book-art/card-017.png",
    "width": 128,
    "height": 471,
    "source": {
      "kind": "flashcard",
      "number": 17
    }
  },
  "1:two": {
    "file": "book-art/card-019.png",
    "width": 322,
    "height": 477,
    "source": {
      "kind": "flashcard",
      "number": 19
    }
  },
  "1:three": {
    "file": "book-art/card-021.png",
    "width": 295,
    "height": 483,
    "source": {
      "kind": "flashcard",
      "number": 21
    }
  },
  "1:four": {
    "file": "book-art/card-023.png",
    "width": 330,
    "height": 477,
    "source": {
      "kind": "flashcard",
      "number": 23
    }
  },
  "1:five": {
    "file": "book-art/card-025.png",
    "width": 296,
    "height": 477,
    "source": {
      "kind": "flashcard",
      "number": 25
    }
  },
  "1:six": {
    "file": "book-art/card-027.png",
    "width": 322,
    "height": 483,
    "source": {
      "kind": "flashcard",
      "number": 27
    }
  },
  "1:seven": {
    "file": "book-art/card-029.png",
    "width": 324,
    "height": 477,
    "source": {
      "kind": "flashcard",
      "number": 29
    }
  },
  "1:eight": {
    "file": "book-art/card-031.png",
    "width": 325,
    "height": 482,
    "source": {
      "kind": "flashcard",
      "number": 31
    }
  },
  "1:nine": {
    "file": "book-art/card-033.png",
    "width": 322,
    "height": 483,
    "source": {
      "kind": "flashcard",
      "number": 33
    }
  },
  "1:ten": {
    "file": "book-art/card-035.png",
    "width": 476,
    "height": 483,
    "source": {
      "kind": "flashcard",
      "number": 35
    }
  },
  "2:book": {
    "file": "book-art/card-055.png",
    "width": 476,
    "height": 409,
    "source": {
      "kind": "flashcard",
      "number": 55
    }
  },
  "2:chair": {
    "file": "book-art/card-057.png",
    "width": 400,
    "height": 580,
    "source": {
      "kind": "flashcard",
      "number": 57
    }
  },
  "2:table": {
    "file": "book-art/card-053.png",
    "width": 476,
    "height": 353,
    "source": {
      "kind": "flashcard",
      "number": 53
    }
  },
  "2:pen": {
    "file": "book-art/card-061.png",
    "width": 435,
    "height": 492,
    "source": {
      "kind": "flashcard",
      "number": 61
    }
  },
  "2:pencil": {
    "file": "book-art/card-063.png",
    "width": 444,
    "height": 578,
    "source": {
      "kind": "flashcard",
      "number": 63
    }
  },
  "2:eraser": {
    "file": "book-art/card-059.png",
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
    "file": "book-art/card-071.png",
    "width": 393,
    "height": 385,
    "source": {
      "kind": "flashcard",
      "number": 71
    }
  },
  "3:bike": {
    "file": "book-art/card-077.png",
    "width": 480,
    "height": 442,
    "source": {
      "kind": "flashcard",
      "number": 77
    }
  },
  "3:car": {
    "file": "book-art/card-069.png",
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
    "file": "book-art/card-079.png",
    "width": 480,
    "height": 340,
    "source": {
      "kind": "flashcard",
      "number": 79
    }
  },
  "3:computer": {
    "file": "book-art/card-075.png",
    "width": 471,
    "height": 584,
    "source": {
      "kind": "flashcard",
      "number": 75
    }
  },
  "3:black": {
    "file": "book-art/card-081.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 81
    }
  },
  "3:white": {
    "file": "book-art/card-085.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 85
    }
  },
  "3:brown": {
    "file": "book-art/card-083.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 83
    }
  },
  "3:grey": {
    "file": "book-art/card-087.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 87
    }
  },
  "4:mother": {
    "file": "book-art/card-007.png",
    "width": 244,
    "height": 624,
    "source": {
      "kind": "flashcard",
      "number": 7
    }
  },
  "4:father": {
    "file": "book-art/card-009.png",
    "width": 252,
    "height": 624,
    "source": {
      "kind": "flashcard",
      "number": 9
    }
  },
  "4:brother": {
    "file": "book-art/card-003.png",
    "width": 296,
    "height": 599,
    "source": {
      "kind": "flashcard",
      "number": 3
    }
  },
  "4:sister": {
    "file": "book-art/card-005.png",
    "width": 268,
    "height": 624,
    "source": {
      "kind": "flashcard",
      "number": 5
    }
  },
  "4:grandmother": {
    "file": "book-art/card-089.png",
    "width": 535,
    "height": 570,
    "source": {
      "kind": "flashcard",
      "number": 89
    }
  },
  "4:grandfather": {
    "file": "book-art/card-091.png",
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
    "file": "book-art/card-093.png",
    "width": 416,
    "height": 455,
    "source": {
      "kind": "flashcard",
      "number": 93
    }
  },
  "5:dog": {
    "file": "book-art/card-095.png",
    "width": 396,
    "height": 624,
    "source": {
      "kind": "flashcard",
      "number": 95
    }
  },
  "5:bird": {
    "file": "book-art/card-103.png",
    "width": 443,
    "height": 624,
    "source": {
      "kind": "flashcard",
      "number": 103
    }
  },
  "5:fish": {
    "file": "book-art/card-097.png",
    "width": 430,
    "height": 541,
    "source": {
      "kind": "flashcard",
      "number": 97
    }
  },
  "5:horse": {
    "file": "book-art/card-099.png",
    "width": 432,
    "height": 599,
    "source": {
      "kind": "flashcard",
      "number": 99
    }
  },
  "5:mouse": {
    "file": "book-art/card-101.png",
    "width": 446,
    "height": 494,
    "source": {
      "kind": "flashcard",
      "number": 101
    }
  },
  "6:face": {
    "file": "book-art/card-105.png",
    "width": 482,
    "height": 468,
    "source": {
      "kind": "flashcard",
      "number": 105
    }
  },
  "6:eye": {
    "file": "book-art/card-109.png",
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
    "file": "book-art/card-113.png",
    "width": 482,
    "height": 486,
    "source": {
      "kind": "flashcard",
      "number": 113
    }
  },
  "6:mouth": {
    "file": "book-art/card-111.png",
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
    "file": "book-art/card-115.png",
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
    "file": "book-art/card-123.png",
    "width": 415,
    "height": 624,
    "source": {
      "kind": "flashcard",
      "number": 123
    }
  },
  "7:elephant": {
    "file": "book-art/card-119.png",
    "width": 522,
    "height": 532,
    "source": {
      "kind": "flashcard",
      "number": 119
    }
  },
  "7:snake": {
    "file": "book-art/card-125.png",
    "width": 483,
    "height": 599,
    "source": {
      "kind": "flashcard",
      "number": 125
    }
  },
  "7:hippo": {
    "file": "book-art/card-121.png",
    "width": 443,
    "height": 451,
    "source": {
      "kind": "flashcard",
      "number": 121
    }
  },
  "7:crocodile": {
    "file": "book-art/card-117.png",
    "width": 520,
    "height": 582,
    "source": {
      "kind": "flashcard",
      "number": 117
    }
  },
  "7:monkey": {
    "file": "book-art/card-129.png",
    "width": 493,
    "height": 609,
    "source": {
      "kind": "flashcard",
      "number": 129
    }
  },
  "7:tiger": {
    "file": "book-art/card-127.png",
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
    "file": "book-art/card-107.png",
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
    "file": "book-art/card-141.png",
    "width": 484,
    "height": 483,
    "source": {
      "kind": "flashcard",
      "number": 141
    }
  },
  "8:skirt": {
    "file": "book-art/card-135.png",
    "width": 499,
    "height": 388,
    "source": {
      "kind": "flashcard",
      "number": 135
    }
  },
  "8:trousers": {
    "file": "book-art/card-139.png",
    "width": 300,
    "height": 587,
    "source": {
      "kind": "flashcard",
      "number": 139
    }
  },
  "8:shoes": {
    "file": "book-art/card-133.png",
    "width": 454,
    "height": 462,
    "source": {
      "kind": "flashcard",
      "number": 133
    }
  },
  "8:socks": {
    "file": "book-art/card-137.png",
    "width": 462,
    "height": 468,
    "source": {
      "kind": "flashcard",
      "number": 137
    }
  },
  "8:jacket": {
    "file": "book-art/card-131.png",
    "width": 509,
    "height": 564,
    "source": {
      "kind": "flashcard",
      "number": 131
    }
  },
  "9:swim": {
    "file": "book-art/card-153.png",
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
    "file": "book-art/card-155.png",
    "width": 482,
    "height": 568,
    "source": {
      "kind": "flashcard",
      "number": 155
    }
  },
  "9:football": {
    "file": "book-art/card-143.png",
    "width": 488,
    "height": 606,
    "source": {
      "kind": "flashcard",
      "number": 143
    }
  },
  "9:tennis": {
    "file": "book-art/card-147.png",
    "width": 473,
    "height": 624,
    "source": {
      "kind": "flashcard",
      "number": 147
    }
  },
  "9:basketball": {
    "file": "book-art/card-145.png",
    "width": 457,
    "height": 624,
    "source": {
      "kind": "flashcard",
      "number": 145
    }
  },
  "10:bus": {
    "file": "book-art/card-157.png",
    "width": 505,
    "height": 400,
    "source": {
      "kind": "flashcard",
      "number": 157
    }
  },
  "10:boat": {
    "file": "book-art/card-167.png",
    "width": 449,
    "height": 608,
    "source": {
      "kind": "flashcard",
      "number": 167
    }
  },
  "10:plane": {
    "file": "book-art/card-165.png",
    "width": 479,
    "height": 466,
    "source": {
      "kind": "flashcard",
      "number": 165
    }
  },
  "10:helicopter": {
    "file": "book-art/card-163.png",
    "width": 447,
    "height": 541,
    "source": {
      "kind": "flashcard",
      "number": 163
    }
  },
  "10:lorry": {
    "file": "book-art/card-159.png",
    "width": 486,
    "height": 470,
    "source": {
      "kind": "flashcard",
      "number": 159
    }
  },
  "10:motorbike": {
    "file": "book-art/card-161.png",
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
    "file": "book-art/card-179.png",
    "width": 439,
    "height": 624,
    "source": {
      "kind": "flashcard",
      "number": 179
    }
  },
  "11:bedroom": {
    "file": "book-art/card-171.png",
    "width": 493,
    "height": 602,
    "source": {
      "kind": "flashcard",
      "number": 171
    }
  },
  "11:bathroom": {
    "file": "book-art/card-169.png",
    "width": 514,
    "height": 512,
    "source": {
      "kind": "flashcard",
      "number": 169
    }
  },
  "11:kitchen": {
    "file": "book-art/card-177.png",
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
    "file": "book-art/card-181.png",
    "width": 437,
    "height": 426,
    "source": {
      "kind": "flashcard",
      "number": 181
    }
  },
  "12:banana": {
    "file": "book-art/card-183.png",
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
    "file": "book-art/card-187.png",
    "width": 440,
    "height": 471,
    "source": {
      "kind": "flashcard",
      "number": 187
    }
  },
  "12:chocolate": {
    "file": "book-art/card-189.png",
    "width": 528,
    "height": 504,
    "source": {
      "kind": "flashcard",
      "number": 189
    }
  },
  "12:ice-cream": {
    "file": "book-art/card-191.png",
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
    "file": "book-art/word-5-big.png",
    "width": 600,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 57
    }
  },
  "5:small": {
    "file": "book-art/word-5-small.png",
    "width": 600,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 57
    }
  },
  "5:long": {
    "file": "book-art/word-5-long.png",
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
    "file": "book-art/word-5-short.png",
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

export const originalFlashcardArt: Record<number, OriginalArt> = {
  "1": {
    "file": "book-art/card-001.png",
    "width": 284,
    "height": 493,
    "source": {
      "kind": "flashcard",
      "number": 1
    }
  },
  "3": {
    "file": "book-art/card-003.png",
    "width": 296,
    "height": 599,
    "source": {
      "kind": "flashcard",
      "number": 3
    }
  },
  "5": {
    "file": "book-art/card-005.png",
    "width": 258,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 5
    }
  },
  "7": {
    "file": "book-art/card-007.png",
    "width": 232,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 7
    }
  },
  "9": {
    "file": "book-art/card-009.png",
    "width": 240,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 9
    }
  },
  "11": {
    "file": "book-art/card-011.png",
    "width": 411,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 11
    }
  },
  "13": {
    "file": "book-art/card-013.png",
    "width": 293,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 13
    }
  },
  "15": {
    "file": "book-art/card-015.png",
    "width": 381,
    "height": 517,
    "source": {
      "kind": "flashcard",
      "number": 15
    }
  },
  "17": {
    "file": "book-art/card-017.png",
    "width": 128,
    "height": 471,
    "source": {
      "kind": "flashcard",
      "number": 17
    }
  },
  "19": {
    "file": "book-art/card-019.png",
    "width": 322,
    "height": 477,
    "source": {
      "kind": "flashcard",
      "number": 19
    }
  },
  "21": {
    "file": "book-art/card-021.png",
    "width": 295,
    "height": 483,
    "source": {
      "kind": "flashcard",
      "number": 21
    }
  },
  "23": {
    "file": "book-art/card-023.png",
    "width": 330,
    "height": 477,
    "source": {
      "kind": "flashcard",
      "number": 23
    }
  },
  "25": {
    "file": "book-art/card-025.png",
    "width": 296,
    "height": 477,
    "source": {
      "kind": "flashcard",
      "number": 25
    }
  },
  "27": {
    "file": "book-art/card-027.png",
    "width": 322,
    "height": 483,
    "source": {
      "kind": "flashcard",
      "number": 27
    }
  },
  "29": {
    "file": "book-art/card-029.png",
    "width": 324,
    "height": 477,
    "source": {
      "kind": "flashcard",
      "number": 29
    }
  },
  "31": {
    "file": "book-art/card-031.png",
    "width": 325,
    "height": 482,
    "source": {
      "kind": "flashcard",
      "number": 31
    }
  },
  "33": {
    "file": "book-art/card-033.png",
    "width": 322,
    "height": 483,
    "source": {
      "kind": "flashcard",
      "number": 33
    }
  },
  "35": {
    "file": "book-art/card-035.png",
    "width": 476,
    "height": 483,
    "source": {
      "kind": "flashcard",
      "number": 35
    }
  },
  "37": {
    "file": "book-art/card-037.png",
    "width": 278,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 37
    }
  },
  "39": {
    "file": "book-art/card-039.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 39
    }
  },
  "41": {
    "file": "book-art/card-041.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 41
    }
  },
  "43": {
    "file": "book-art/card-043.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 43
    }
  },
  "45": {
    "file": "book-art/card-045.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 45
    }
  },
  "47": {
    "file": "book-art/card-047.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 47
    }
  },
  "49": {
    "file": "book-art/card-049.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 49
    }
  },
  "51": {
    "file": "book-art/card-051.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 51
    }
  },
  "53": {
    "file": "book-art/card-053.png",
    "width": 476,
    "height": 353,
    "source": {
      "kind": "flashcard",
      "number": 53
    }
  },
  "55": {
    "file": "book-art/card-055.png",
    "width": 476,
    "height": 409,
    "source": {
      "kind": "flashcard",
      "number": 55
    }
  },
  "57": {
    "file": "book-art/card-057.png",
    "width": 400,
    "height": 580,
    "source": {
      "kind": "flashcard",
      "number": 57
    }
  },
  "59": {
    "file": "book-art/card-059.png",
    "width": 461,
    "height": 313,
    "source": {
      "kind": "flashcard",
      "number": 59
    }
  },
  "61": {
    "file": "book-art/card-061.png",
    "width": 435,
    "height": 492,
    "source": {
      "kind": "flashcard",
      "number": 61
    }
  },
  "63": {
    "file": "book-art/card-063.png",
    "width": 444,
    "height": 578,
    "source": {
      "kind": "flashcard",
      "number": 63
    }
  },
  "65": {
    "file": "book-art/card-065.png",
    "width": 212,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 65
    }
  },
  "67": {
    "file": "book-art/card-067.png",
    "width": 253,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 67
    }
  },
  "69": {
    "file": "book-art/card-069.png",
    "width": 493,
    "height": 513,
    "source": {
      "kind": "flashcard",
      "number": 69
    }
  },
  "71": {
    "file": "book-art/card-071.png",
    "width": 393,
    "height": 385,
    "source": {
      "kind": "flashcard",
      "number": 71
    }
  },
  "75": {
    "file": "book-art/card-075.png",
    "width": 471,
    "height": 584,
    "source": {
      "kind": "flashcard",
      "number": 75
    }
  },
  "77": {
    "file": "book-art/card-077.png",
    "width": 480,
    "height": 442,
    "source": {
      "kind": "flashcard",
      "number": 77
    }
  },
  "79": {
    "file": "book-art/card-079.png",
    "width": 480,
    "height": 340,
    "source": {
      "kind": "flashcard",
      "number": 79
    }
  },
  "81": {
    "file": "book-art/card-081.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 81
    }
  },
  "83": {
    "file": "book-art/card-083.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 83
    }
  },
  "85": {
    "file": "book-art/card-085.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 85
    }
  },
  "87": {
    "file": "book-art/card-087.png",
    "width": 527,
    "height": 464,
    "source": {
      "kind": "flashcard",
      "number": 87
    }
  },
  "89": {
    "file": "book-art/card-089.png",
    "width": 535,
    "height": 570,
    "source": {
      "kind": "flashcard",
      "number": 89
    }
  },
  "91": {
    "file": "book-art/card-091.png",
    "width": 224,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 91
    }
  },
  "93": {
    "file": "book-art/card-093.png",
    "width": 416,
    "height": 455,
    "source": {
      "kind": "flashcard",
      "number": 93
    }
  },
  "95": {
    "file": "book-art/card-095.png",
    "width": 381,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 95
    }
  },
  "97": {
    "file": "book-art/card-097.png",
    "width": 430,
    "height": 541,
    "source": {
      "kind": "flashcard",
      "number": 97
    }
  },
  "99": {
    "file": "book-art/card-099.png",
    "width": 432,
    "height": 599,
    "source": {
      "kind": "flashcard",
      "number": 99
    }
  },
  "101": {
    "file": "book-art/card-101.png",
    "width": 446,
    "height": 494,
    "source": {
      "kind": "flashcard",
      "number": 101
    }
  },
  "103": {
    "file": "book-art/card-103.png",
    "width": 426,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 103
    }
  },
  "105": {
    "file": "book-art/card-105.png",
    "width": 482,
    "height": 468,
    "source": {
      "kind": "flashcard",
      "number": 105
    }
  },
  "107": {
    "file": "book-art/card-107.png",
    "width": 479,
    "height": 478,
    "source": {
      "kind": "flashcard",
      "number": 107
    }
  },
  "109": {
    "file": "book-art/card-109.png",
    "width": 481,
    "height": 482,
    "source": {
      "kind": "flashcard",
      "number": 109
    }
  },
  "111": {
    "file": "book-art/card-111.png",
    "width": 486,
    "height": 484,
    "source": {
      "kind": "flashcard",
      "number": 111
    }
  },
  "113": {
    "file": "book-art/card-113.png",
    "width": 482,
    "height": 486,
    "source": {
      "kind": "flashcard",
      "number": 113
    }
  },
  "115": {
    "file": "book-art/card-115.png",
    "width": 485,
    "height": 483,
    "source": {
      "kind": "flashcard",
      "number": 115
    }
  },
  "117": {
    "file": "book-art/card-117.png",
    "width": 520,
    "height": 582,
    "source": {
      "kind": "flashcard",
      "number": 117
    }
  },
  "119": {
    "file": "book-art/card-119.png",
    "width": 522,
    "height": 532,
    "source": {
      "kind": "flashcard",
      "number": 119
    }
  },
  "121": {
    "file": "book-art/card-121.png",
    "width": 443,
    "height": 451,
    "source": {
      "kind": "flashcard",
      "number": 121
    }
  },
  "123": {
    "file": "book-art/card-123.png",
    "width": 398,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 123
    }
  },
  "125": {
    "file": "book-art/card-125.png",
    "width": 483,
    "height": 599,
    "source": {
      "kind": "flashcard",
      "number": 125
    }
  },
  "127": {
    "file": "book-art/card-127.png",
    "width": 516,
    "height": 572,
    "source": {
      "kind": "flashcard",
      "number": 127
    }
  },
  "129": {
    "file": "book-art/card-129.png",
    "width": 486,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 129
    }
  },
  "131": {
    "file": "book-art/card-131.png",
    "width": 509,
    "height": 564,
    "source": {
      "kind": "flashcard",
      "number": 131
    }
  },
  "133": {
    "file": "book-art/card-133.png",
    "width": 454,
    "height": 462,
    "source": {
      "kind": "flashcard",
      "number": 133
    }
  },
  "135": {
    "file": "book-art/card-135.png",
    "width": 499,
    "height": 388,
    "source": {
      "kind": "flashcard",
      "number": 135
    }
  },
  "137": {
    "file": "book-art/card-137.png",
    "width": 462,
    "height": 468,
    "source": {
      "kind": "flashcard",
      "number": 137
    }
  },
  "139": {
    "file": "book-art/card-139.png",
    "width": 300,
    "height": 587,
    "source": {
      "kind": "flashcard",
      "number": 139
    }
  },
  "141": {
    "file": "book-art/card-141.png",
    "width": 484,
    "height": 483,
    "source": {
      "kind": "flashcard",
      "number": 141
    }
  },
  "143": {
    "file": "book-art/card-143.png",
    "width": 483,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 143
    }
  },
  "145": {
    "file": "book-art/card-145.png",
    "width": 439,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 145
    }
  },
  "147": {
    "file": "book-art/card-147.png",
    "width": 454,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 147
    }
  },
  "149": {
    "file": "book-art/card-149.png",
    "width": 432,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 149
    }
  },
  "151": {
    "file": "book-art/card-151.png",
    "width": 534,
    "height": 593,
    "source": {
      "kind": "flashcard",
      "number": 151
    }
  },
  "153": {
    "file": "book-art/card-153.png",
    "width": 529,
    "height": 484,
    "source": {
      "kind": "flashcard",
      "number": 153
    }
  },
  "155": {
    "file": "book-art/card-155.png",
    "width": 482,
    "height": 568,
    "source": {
      "kind": "flashcard",
      "number": 155
    }
  },
  "157": {
    "file": "book-art/card-157.png",
    "width": 505,
    "height": 400,
    "source": {
      "kind": "flashcard",
      "number": 157
    }
  },
  "159": {
    "file": "book-art/card-159.png",
    "width": 486,
    "height": 470,
    "source": {
      "kind": "flashcard",
      "number": 159
    }
  },
  "161": {
    "file": "book-art/card-161.png",
    "width": 487,
    "height": 377,
    "source": {
      "kind": "flashcard",
      "number": 161
    }
  },
  "163": {
    "file": "book-art/card-163.png",
    "width": 447,
    "height": 541,
    "source": {
      "kind": "flashcard",
      "number": 163
    }
  },
  "165": {
    "file": "book-art/card-165.png",
    "width": 479,
    "height": 466,
    "source": {
      "kind": "flashcard",
      "number": 165
    }
  },
  "167": {
    "file": "book-art/card-167.png",
    "width": 443,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 167
    }
  },
  "169": {
    "file": "book-art/card-169.png",
    "width": 514,
    "height": 512,
    "source": {
      "kind": "flashcard",
      "number": 169
    }
  },
  "171": {
    "file": "book-art/card-171.png",
    "width": 491,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 171
    }
  },
  "173": {
    "file": "book-art/card-173.png",
    "width": 426,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 173
    }
  },
  "175": {
    "file": "book-art/card-175.png",
    "width": 430,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 175
    }
  },
  "177": {
    "file": "book-art/card-177.png",
    "width": 430,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 177
    }
  },
  "179": {
    "file": "book-art/card-179.png",
    "width": 422,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 179
    }
  },
  "181": {
    "file": "book-art/card-181.png",
    "width": 437,
    "height": 426,
    "source": {
      "kind": "flashcard",
      "number": 181
    }
  },
  "183": {
    "file": "book-art/card-183.png",
    "width": 455,
    "height": 545,
    "source": {
      "kind": "flashcard",
      "number": 183
    }
  },
  "185": {
    "file": "book-art/card-185.png",
    "width": 423,
    "height": 403,
    "source": {
      "kind": "flashcard",
      "number": 185
    }
  },
  "187": {
    "file": "book-art/card-187.png",
    "width": 440,
    "height": 471,
    "source": {
      "kind": "flashcard",
      "number": 187
    }
  },
  "189": {
    "file": "book-art/card-189.png",
    "width": 528,
    "height": 504,
    "source": {
      "kind": "flashcard",
      "number": 189
    }
  },
  "191": {
    "file": "book-art/card-191.png",
    "width": 352,
    "height": 600,
    "source": {
      "kind": "flashcard",
      "number": 191
    }
  }
};
