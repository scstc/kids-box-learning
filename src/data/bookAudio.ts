export type BookAudioReference = { unitId?: number; page: number; activity: number; disc: number; track: number; file?: string; source?: string; x: number; y: number; width: number; height: number };
export type RelatedBookAudio = { file: string; name: string; unitId: number | null; kind: string };

// CD/track numbers checked against the supplied PDF. Verified ID3/intro overrides misleading filenames.
export const bookAudioReferences: BookAudioReference[] = [
  {
    "unitId": 1,
    "page": 4,
    "activity": 1,
    "disc": 1,
    "track": 2,
    "file": "音频/CD1/cd1_02_Track_02.mp3",
    "source": "cd-track",
    "x": 16.918,
    "y": 18.75,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 1,
    "page": 4,
    "activity": 2,
    "disc": 1,
    "track": 3,
    "file": "音频/CD1/cd1_03_Track_03.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 86.938,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 1,
    "page": 5,
    "activity": 3,
    "disc": 1,
    "track": 5,
    "file": "音频/CD1/cd1_05_Track_05.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 1,
    "page": 5,
    "activity": 4,
    "disc": 1,
    "track": 6,
    "file": "音频/CD1/cd1_06_Track_06.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 53.5,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 1,
    "page": 6,
    "activity": 5,
    "disc": 1,
    "track": 7,
    "file": "音频/u4_pb_p6_5.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 7.688,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 1,
    "page": 6,
    "activity": 6,
    "disc": 1,
    "track": 8,
    "file": "音频/CD1/cd1_08_Track_08.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 67.625,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 1,
    "page": 7,
    "activity": 7,
    "disc": 1,
    "track": 10,
    "file": "音频/u4_pb_p7_7.mp3",
    "source": "page-activity",
    "x": 12.788,
    "y": 7.688,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 1,
    "page": 7,
    "activity": 8,
    "disc": 1,
    "track": 12,
    "file": "音频/CD1/cd1_12_Track_12.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 55.688,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 1,
    "page": 8,
    "activity": 9,
    "disc": 1,
    "track": 14,
    "file": "音频/u4_pb_p8_9.mp3",
    "source": "page-activity",
    "x": 15.647,
    "y": 8.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 1,
    "page": 9,
    "activity": 11,
    "disc": 1,
    "track": 17,
    "file": "音频/CD1/cd1_17_Track_17.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 7.563,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 1,
    "page": 9,
    "activity": 12,
    "disc": 1,
    "track": 18,
    "file": "音频/CD1/cd1_18_Track_18.mp3",
    "source": "cd-track",
    "x": 13.264,
    "y": 88.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 2,
    "page": 10,
    "activity": 1,
    "disc": 1,
    "track": 19,
    "file": "音频/CD1/cd1_19_Track_19.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 18.75,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 2,
    "page": 10,
    "activity": 2,
    "disc": 1,
    "track": 20,
    "file": "音频/CD1/cd1_20_Track_20.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 86.938,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 2,
    "page": 11,
    "activity": 3,
    "disc": 1,
    "track": 22,
    "file": "音频/CD1/cd1_22_Track_22.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 2,
    "page": 11,
    "activity": 4,
    "disc": 1,
    "track": 23,
    "file": "音频/CD1/cd1_23_Track_23.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 51.688,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 2,
    "page": 12,
    "activity": 5,
    "disc": 1,
    "track": 24,
    "file": "音频/CD1/cd1_24_Track_24.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 7.688,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 2,
    "page": 12,
    "activity": 6,
    "disc": 1,
    "track": 25,
    "file": "音频/u4_pb_p12_6.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 86,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 2,
    "page": 13,
    "activity": 8,
    "disc": 1,
    "track": 27,
    "file": "音频/u4_pb_p13_8.mp3",
    "source": "page-activity",
    "x": 12.788,
    "y": 49.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 2,
    "page": 14,
    "activity": 9,
    "disc": 1,
    "track": 29,
    "file": "音频/u4_pb_p14_9.mp3",
    "source": "page-activity",
    "x": 15.647,
    "y": 8.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 2,
    "page": 15,
    "activity": 11,
    "disc": 1,
    "track": 32,
    "file": "音频/u4_pb_p15_11.mp3",
    "source": "page-activity",
    "x": 12.788,
    "y": 7.563,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 3,
    "page": 18,
    "activity": 1,
    "disc": 1,
    "track": 36,
    "file": "音频/CD1/cd1_36_Track_36.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 18.75,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 3,
    "page": 18,
    "activity": 2,
    "disc": 1,
    "track": 37,
    "file": "音频/CD1/cd1_37_Track_37.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 86.938,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 3,
    "page": 19,
    "activity": 3,
    "disc": 1,
    "track": 39,
    "file": "音频/CD1/cd1_39_Track_39.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 3,
    "page": 19,
    "activity": 4,
    "disc": 1,
    "track": 40,
    "file": "音频/CD1/cd1_40_Track_40.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 50.25,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 3,
    "page": 20,
    "activity": 5,
    "disc": 1,
    "track": 42,
    "file": "音频/u4_pb_p20_5.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 3,
    "page": 20,
    "activity": 6,
    "disc": 1,
    "track": 43,
    "file": "音频/u4_pb_p20_6.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 85.875,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 3,
    "page": 21,
    "activity": 7,
    "disc": 1,
    "track": 45,
    "file": "音频/u4_pb_p21_7.mp3",
    "source": "page-activity",
    "x": 12.788,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 3,
    "page": 22,
    "activity": 9,
    "disc": 1,
    "track": 48,
    "file": "音频/u4_pb_p22_9.mp3",
    "source": "page-activity",
    "x": 15.647,
    "y": 8.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 3,
    "page": 23,
    "activity": 11,
    "disc": 1,
    "track": 51,
    "file": "音频/CD1/cd1_51_Track_51.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 7.563,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 3,
    "page": 23,
    "activity": 12,
    "disc": 1,
    "track": 52,
    "file": "音频/CD1/cd1_52_Track_52.mp3",
    "source": "cd-track",
    "x": 13.264,
    "y": 88.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 4,
    "page": 24,
    "activity": 1,
    "disc": 2,
    "track": 2,
    "file": "音频/u4_pb_p24_1.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 18.75,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 4,
    "page": 24,
    "activity": 2,
    "disc": 2,
    "track": 3,
    "file": "音频/u4_pb_p24_2.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 87.875,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 4,
    "page": 25,
    "activity": 3,
    "disc": 2,
    "track": 5,
    "x": 12.788,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 4,
    "page": 25,
    "activity": 4,
    "disc": 2,
    "track": 6,
    "file": "音频/CD2/u4_pb_p25_4.mp3",
    "source": "page-activity",
    "x": 12.788,
    "y": 84.625,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 4,
    "page": 26,
    "activity": 5,
    "disc": 2,
    "track": 8,
    "file": "音频/CD2/08_track_08.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 4,
    "page": 26,
    "activity": 6,
    "disc": 2,
    "track": 9,
    "file": "音频/pb_pag_26_6.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 85.875,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 4,
    "page": 27,
    "activity": 7,
    "disc": 2,
    "track": 11,
    "file": "音频/pb_pag_27_7.mp3",
    "source": "page-activity",
    "x": 12.788,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 4,
    "page": 27,
    "activity": 8,
    "disc": 2,
    "track": 13,
    "file": "音频/pb_pag_27_8.mp3",
    "source": "page-activity",
    "x": 12.788,
    "y": 87.625,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 4,
    "page": 28,
    "activity": 9,
    "disc": 2,
    "track": 14,
    "file": "音频/pb_pag_28_9.mp3",
    "source": "page-activity",
    "x": 15.806,
    "y": 8.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 4,
    "page": 28,
    "activity": 10,
    "disc": 2,
    "track": 15,
    "file": "音频/pb_pag_28_10.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 49.875,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 4,
    "page": 29,
    "activity": 11,
    "disc": 2,
    "track": 18,
    "file": "音频/pb_pag_29_11.mp3",
    "source": "page-activity",
    "x": 12.788,
    "y": 7.563,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 4,
    "page": 29,
    "activity": 12,
    "disc": 2,
    "track": 19,
    "file": "音频/CD2/19_track_19.mp3",
    "source": "cd-track",
    "x": 12.947,
    "y": 88.5,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 5,
    "page": 34,
    "activity": 1,
    "disc": 2,
    "track": 26,
    "file": "音频/CD2/cd2_26_Track_26.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 18.75,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 5,
    "page": 34,
    "activity": 2,
    "disc": 2,
    "track": 27,
    "file": "音频/u4_pb_p34_2.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 86.938,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 5,
    "page": 35,
    "activity": 3,
    "disc": 2,
    "track": 29,
    "file": "音频/CD2/cd2_29_Track_29.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 5,
    "page": 35,
    "activity": 4,
    "disc": 2,
    "track": 30,
    "file": "音频/CD2/cd2_30_Track_30.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 50.25,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 5,
    "page": 36,
    "activity": 5,
    "disc": 2,
    "track": 31,
    "file": "音频/CD2/cd2_31_Track_31.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 5,
    "page": 36,
    "activity": 6,
    "disc": 2,
    "track": 32,
    "file": "音频/CD2/cd2_32_Track_32.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 85.813,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 5,
    "page": 37,
    "activity": 7,
    "disc": 2,
    "track": 34,
    "file": "音频/u4_pb_p37_7.mp3",
    "source": "page-activity",
    "x": 12.788,
    "y": 8.063,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 5,
    "page": 37,
    "activity": 8,
    "disc": 2,
    "track": 35,
    "file": "音频/CD2/cd2_35_Track_35.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 87.625,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 5,
    "page": 38,
    "activity": 9,
    "disc": 2,
    "track": 37,
    "file": "音频/u4_pb_p38_9.mp3",
    "source": "page-activity",
    "x": 15.806,
    "y": 8.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 5,
    "page": 39,
    "activity": 11,
    "disc": 2,
    "track": 39,
    "file": "音频/CD2/cd2_39_Track_39.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 7.563,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 6,
    "page": 40,
    "activity": 1,
    "disc": 2,
    "track": 40,
    "file": "音频/CD2/cd2_40_Track_40.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 17.625,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 6,
    "page": 40,
    "activity": 2,
    "disc": 2,
    "track": 41,
    "file": "音频/CD2/cd2_41_Track_41.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 87.875,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 6,
    "page": 41,
    "activity": 3,
    "disc": 2,
    "track": 43,
    "file": "音频/CD2/cd2_43_Track_43.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 6,
    "page": 41,
    "activity": 4,
    "disc": 2,
    "track": 44,
    "file": "音频/u4_pb_p41_4.mp3",
    "source": "page-activity",
    "x": 12.788,
    "y": 50.188,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 6,
    "page": 42,
    "activity": 5,
    "disc": 2,
    "track": 46,
    "file": "音频/CD2/cd2_46_Track_46.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 6,
    "page": 42,
    "activity": 6,
    "disc": 2,
    "track": 47,
    "file": "音频/u4_pb_p42_6.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 84.063,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 6,
    "page": 43,
    "activity": 7,
    "disc": 2,
    "track": 49,
    "file": "音频/u4_pb_p43_7.mp3",
    "source": "page-activity",
    "x": 12.788,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 6,
    "page": 44,
    "activity": 9,
    "disc": 2,
    "track": 51,
    "file": "音频/u4_pb_p44_9.mp3",
    "source": "page-activity",
    "x": 15.806,
    "y": 8.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 6,
    "page": 45,
    "activity": 11,
    "disc": 2,
    "track": 54,
    "file": "音频/CD2/cd2_54_Track_54.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 7.563,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 6,
    "page": 45,
    "activity": 12,
    "disc": 2,
    "track": 55,
    "file": "音频/CD2/cd2_55_Track_55.mp3",
    "source": "cd-track",
    "x": 13.264,
    "y": 88.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 7,
    "page": 48,
    "activity": 1,
    "disc": 3,
    "track": 2,
    "file": "音频/CD3/cd3_02_Track_02.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 18.75,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 7,
    "page": 48,
    "activity": 2,
    "disc": 3,
    "track": 3,
    "file": "音频/CD3/cd3_03_Track_03.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 86.938,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 7,
    "page": 49,
    "activity": 3,
    "disc": 3,
    "track": 5,
    "file": "音频/CD3/cd3_05_Track_05.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 7,
    "page": 49,
    "activity": 4,
    "disc": 3,
    "track": 6,
    "file": "音频/CD3/cd3_06_Track_06.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 50.25,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 7,
    "page": 50,
    "activity": 5,
    "disc": 3,
    "track": 7,
    "x": 16.124,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 7,
    "page": 50,
    "activity": 6,
    "disc": 3,
    "track": 8,
    "file": "音频/u4_pb_p50_6.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 85.188,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 7,
    "page": 51,
    "activity": 7,
    "disc": 3,
    "track": 10,
    "file": "音频/u4_pb_p51_7.mp3",
    "source": "page-activity",
    "x": 12.788,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 7,
    "page": 52,
    "activity": 9,
    "disc": 3,
    "track": 12,
    "file": "音频/u4_pb_p52_9.mp3",
    "source": "page-activity",
    "x": 15.806,
    "y": 8.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 7,
    "page": 53,
    "activity": 11,
    "disc": 3,
    "track": 14,
    "file": "音频/u4_pb_p53_11.mp3",
    "source": "page-activity",
    "x": 12.788,
    "y": 7.563,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 8,
    "page": 54,
    "activity": 1,
    "disc": 3,
    "track": 15,
    "file": "音频/CD3/cd3_15_Track_15.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 18.75,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 8,
    "page": 54,
    "activity": 2,
    "disc": 3,
    "track": 16,
    "file": "音频/CD3/cd3_16_Track_16.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 87,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 8,
    "page": 55,
    "activity": 3,
    "disc": 3,
    "track": 18,
    "file": "音频/CD3/cd3_18_Track_18.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 8,
    "page": 55,
    "activity": 4,
    "disc": 3,
    "track": 19,
    "file": "音频/CD3/cd3_19_Track_19.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 53.188,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 8,
    "page": 56,
    "activity": 5,
    "disc": 3,
    "track": 21,
    "file": "音频/CD3/cd3_21_Track_21.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 7.688,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 8,
    "page": 56,
    "activity": 6,
    "disc": 3,
    "track": 22,
    "file": "音频/u4_pb_p56_6.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 86.063,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 8,
    "page": 57,
    "activity": 7,
    "disc": 3,
    "track": 25,
    "file": "音频/u4_pb_p57_7.mp3",
    "source": "page-activity",
    "x": 14.059,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 8,
    "page": 57,
    "activity": 8,
    "disc": 3,
    "track": 26,
    "file": "音频/u4_pb_p57_8.mp3",
    "source": "page-activity",
    "x": 12.788,
    "y": 88.313,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 8,
    "page": 58,
    "activity": 9,
    "disc": 3,
    "track": 29,
    "file": "音频/CD3/cd3_29_Track_29.mp3",
    "source": "cd-track",
    "x": 15.806,
    "y": 8.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 8,
    "page": 59,
    "activity": 11,
    "disc": 3,
    "track": 31,
    "file": "音频/CD3/cd3_31_Track_31.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 7.563,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 8,
    "page": 59,
    "activity": 12,
    "disc": 3,
    "track": 32,
    "file": "音频/CD3/cd3_32_Track_32.mp3",
    "source": "cd-track",
    "x": 12.947,
    "y": 88.5,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 9,
    "page": 64,
    "activity": 1,
    "disc": 3,
    "track": 38,
    "file": "音频/CD3/cd3_38_Track_38.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 18.75,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 9,
    "page": 64,
    "activity": 2,
    "disc": 3,
    "track": 39,
    "file": "音频/CD3/cd3_39_Track_39.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 86.938,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 9,
    "page": 65,
    "activity": 3,
    "disc": 3,
    "track": 41,
    "file": "音频/CD3/cd3_41_Track_41.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 9,
    "page": 65,
    "activity": 4,
    "disc": 3,
    "track": 42,
    "file": "音频/u4_pb_p65_4.mp3",
    "source": "page-activity",
    "x": 12.788,
    "y": 86.188,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 9,
    "page": 66,
    "activity": 5,
    "disc": 3,
    "track": 44,
    "file": "音频/u4_pb_p66_5.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 9,
    "page": 66,
    "activity": 6,
    "disc": 3,
    "track": 45,
    "file": "音频/u4_pb_p66_6.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 85.188,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 9,
    "page": 67,
    "activity": 7,
    "disc": 3,
    "track": 47,
    "file": "音频/CD3/cd3_47_Track_47.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 9,
    "page": 67,
    "activity": 8,
    "disc": 3,
    "track": 48,
    "file": "音频/CD3/cd3_48_Track_48.mp3",
    "source": "cd-track",
    "x": 11.994,
    "y": 47.313,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 9,
    "page": 68,
    "activity": 9,
    "disc": 3,
    "track": 49,
    "file": "音频/u4_pb_p68_9.mp3",
    "source": "page-activity",
    "x": 15.806,
    "y": 8.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 9,
    "page": 69,
    "activity": 11,
    "disc": 3,
    "track": 51,
    "file": "音频/CD3/cd3_51_Track_51.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 7.563,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 10,
    "page": 70,
    "activity": 1,
    "disc": 4,
    "track": 2,
    "file": "音频/CD4/cd4_02_Track_02.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 16.938,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 10,
    "page": 70,
    "activity": 2,
    "disc": 4,
    "track": 3,
    "file": "音频/CD4/cd4_03_Track_03.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 87.875,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 10,
    "page": 71,
    "activity": 3,
    "disc": 4,
    "track": 5,
    "file": "音频/CD4/cd4_05_Track_05.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 10,
    "page": 71,
    "activity": 4,
    "disc": 4,
    "track": 6,
    "file": "音频/CD4/cd4_06_Track_06.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 31.563,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 10,
    "page": 72,
    "activity": 5,
    "disc": 4,
    "track": 7,
    "file": "音频/CD4/cd4_07_Track_07.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 10,
    "page": 72,
    "activity": 6,
    "disc": 4,
    "track": 8,
    "file": "音频/CD4/cd4_08_Track_08.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 85.875,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 10,
    "page": 73,
    "activity": 7,
    "disc": 4,
    "track": 10,
    "file": "音频/U10_pb_p73_7.mp3",
    "source": "page-activity",
    "x": 12.788,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 10,
    "page": 74,
    "activity": 9,
    "disc": 4,
    "track": 13,
    "file": "音频/U10_pb_p74_9.mp3",
    "source": "page-activity",
    "x": 15.806,
    "y": 8.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 10,
    "page": 74,
    "activity": 10,
    "disc": 4,
    "track": 14,
    "file": "音频/U10_pb_p74_10.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 49,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 10,
    "page": 75,
    "activity": 11,
    "disc": 4,
    "track": 16,
    "file": "音频/CD4/cd4_16_Track_16.mp3",
    "source": "cd-track",
    "x": 13.264,
    "y": 7.563,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 10,
    "page": 75,
    "activity": 12,
    "disc": 4,
    "track": 17,
    "file": "音频/CD4/cd4_17_Track_17.mp3",
    "source": "cd-track",
    "x": 12.947,
    "y": 88.5,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 11,
    "page": 78,
    "activity": 1,
    "disc": 4,
    "track": 21,
    "file": "音频/CD4/cd4_21_Track_21.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 18.75,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 11,
    "page": 78,
    "activity": 2,
    "disc": 4,
    "track": 22,
    "file": "音频/CD4/cd4_22_Track_22.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 86.938,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 11,
    "page": 79,
    "activity": 3,
    "disc": 4,
    "track": 24,
    "file": "音频/U11_pb_p79_3.mp3",
    "source": "page-activity",
    "x": 12.788,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 11,
    "page": 79,
    "activity": 4,
    "disc": 4,
    "track": 25,
    "file": "音频/CD4/cd4_25_Track_25.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 32.313,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 11,
    "page": 80,
    "activity": 5,
    "disc": 4,
    "track": 26,
    "file": "音频/CD4/cd4_26_Track_26.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 11,
    "page": 80,
    "activity": 6,
    "disc": 4,
    "track": 27,
    "file": "音频/CD4/cd4_27_Track_27.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 85.813,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 11,
    "page": 81,
    "activity": 7,
    "disc": 4,
    "track": 29,
    "file": "音频/U11_pb_p81_7.mp3",
    "source": "page-activity",
    "x": 12.788,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 11,
    "page": 82,
    "activity": 9,
    "disc": 4,
    "track": 31,
    "file": "音频/CD4/cd4_31_Track_31.mp3",
    "source": "cd-track",
    "x": 15.806,
    "y": 8.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 11,
    "page": 83,
    "activity": 11,
    "disc": 4,
    "track": 33,
    "file": "音频/CD4/cd4_33_Track_33.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 7.563,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 11,
    "page": 83,
    "activity": 12,
    "disc": 4,
    "track": 34,
    "file": "音频/CD4/cd4_34_Track_34.mp3",
    "source": "cd-track",
    "x": 12.947,
    "y": 88.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 12,
    "page": 84,
    "activity": 1,
    "disc": 4,
    "track": 35,
    "file": "音频/U12_pb_p84_1.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 17.938,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 12,
    "page": 84,
    "activity": 2,
    "disc": 4,
    "track": 36,
    "file": "音频/U12_pb_p84_2.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 87.813,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 12,
    "page": 85,
    "activity": 3,
    "disc": 4,
    "track": 38,
    "x": 12.788,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 12,
    "page": 85,
    "activity": 4,
    "disc": 4,
    "track": 39,
    "file": "音频/CD4/cd4_39_Track_39.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 35.688,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 12,
    "page": 86,
    "activity": 5,
    "disc": 4,
    "track": 40,
    "file": "音频/CD4/cd4_40_Track_40.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 12,
    "page": 86,
    "activity": 6,
    "disc": 4,
    "track": 41,
    "file": "音频/U12_pb_p86_6.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 85.875,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 12,
    "page": 87,
    "activity": 7,
    "disc": 4,
    "track": 43,
    "file": "音频/U12_pb_p87_7.mp3",
    "source": "page-activity",
    "x": 12.788,
    "y": 7.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 12,
    "page": 88,
    "activity": 9,
    "disc": 4,
    "track": 46,
    "file": "音频/U12_pb_p88_9.mp3",
    "source": "page-activity",
    "x": 15.806,
    "y": 8.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 12,
    "page": 88,
    "activity": 10,
    "disc": 4,
    "track": 47,
    "file": "音频/U12_pb_p88_10.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 50.313,
    "width": 5.56,
    "height": 5.25
  },
  {
    "unitId": 12,
    "page": 89,
    "activity": 11,
    "disc": 4,
    "track": 49,
    "file": "音频/CD4/cd4_49_Track_49.mp3",
    "source": "cd-track",
    "x": 12.788,
    "y": 7.563,
    "width": 5.56,
    "height": 5.25
  },
  {
    "page": 16,
    "activity": 2,
    "disc": 1,
    "track": 33,
    "file": "音频/CD1/cd1_33_Track_33.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 49.688,
    "width": 5.56,
    "height": 5.25
  },
  {
    "page": 17,
    "activity": 3,
    "disc": 1,
    "track": 34,
    "file": "音频/CD1/cd1_34_Track_34.mp3",
    "source": "cd-track",
    "x": 15.806,
    "y": 13,
    "width": 5.56,
    "height": 5.25
  },
  {
    "page": 17,
    "activity": 4,
    "disc": 1,
    "track": 35,
    "x": 15.806,
    "y": 85.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "page": 30,
    "activity": 1,
    "disc": 2,
    "track": 20,
    "file": "音频/CD2/u4_pb_p30_1.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 13,
    "width": 5.56,
    "height": 5.25
  },
  {
    "page": 31,
    "activity": 3,
    "disc": 2,
    "track": 21,
    "file": "音频/pb_pag_31_3.mp3",
    "source": "page-activity",
    "x": 15.171,
    "y": 13,
    "width": 5.56,
    "height": 5.25
  },
  {
    "page": 31,
    "activity": 4,
    "disc": 2,
    "track": 22,
    "file": "音频/CD2/cd2_22_Track_22.mp3",
    "source": "cd-track",
    "x": 15.171,
    "y": 85.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "page": 32,
    "activity": 1,
    "disc": 2,
    "track": 23,
    "file": "音频/CD2/cd2_23_Track_ 23.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 20.063,
    "width": 5.56,
    "height": 5.25
  },
  {
    "page": 33,
    "activity": 3,
    "disc": 2,
    "track": 25,
    "file": "音频/pb_pag_33_3.mp3",
    "source": "page-activity",
    "x": 12.788,
    "y": 8.625,
    "width": 5.56,
    "height": 5.25
  },
  {
    "page": 46,
    "activity": 1,
    "disc": 2,
    "track": 56,
    "file": "音频/CD2/cd2_56_Track_56.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 13,
    "width": 5.56,
    "height": 5.25
  },
  {
    "page": 47,
    "activity": 3,
    "disc": 2,
    "track": 57,
    "file": "音频/CD2/cd2_57_Track_57.mp3",
    "source": "cd-track",
    "x": 15.171,
    "y": 13,
    "width": 5.56,
    "height": 5.25
  },
  {
    "page": 60,
    "activity": 1,
    "disc": 3,
    "track": 33,
    "file": "音频/u4_pb_p60_1.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 12.938,
    "width": 5.56,
    "height": 5.25
  },
  {
    "page": 61,
    "activity": 3,
    "disc": 3,
    "track": 34,
    "file": "音频/CD3/cd3_34_Track_34.mp3",
    "source": "cd-track",
    "x": 15.171,
    "y": 13,
    "width": 5.56,
    "height": 5.25
  },
  {
    "page": 61,
    "activity": 4,
    "disc": 3,
    "track": 35,
    "file": "音频/CD3/cd3_35_Track_35.mp3",
    "source": "cd-track",
    "x": 15.171,
    "y": 85.875,
    "width": 5.56,
    "height": 5.25
  },
  {
    "page": 62,
    "activity": 1,
    "disc": 3,
    "track": 36,
    "file": "音频/CD3/cd3_36_Track_36.mp3",
    "source": "cd-track",
    "x": 16.124,
    "y": 20.375,
    "width": 5.56,
    "height": 5.25
  },
  {
    "page": 76,
    "activity": 1,
    "disc": 4,
    "track": 18,
    "file": "音频/U10_pb_p75_12.mp3",
    "source": "id3-track-verified",
    "x": 15.647,
    "y": 13,
    "width": 5.56,
    "height": 5.25
  },
  {
    "page": 77,
    "activity": 3,
    "disc": 4,
    "track": 19,
    "file": "音频/CD4/cd4_19_Track_19.mp3",
    "source": "cd-track",
    "x": 15.33,
    "y": 13,
    "width": 5.56,
    "height": 5.25
  },
  {
    "page": 77,
    "activity": 4,
    "disc": 4,
    "track": 20,
    "file": "音频/CD4/cd4_20_Track_20.mp3",
    "source": "cd-track",
    "x": 14.218,
    "y": 85.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "page": 90,
    "activity": 2,
    "disc": 4,
    "track": 50,
    "file": "音频/U12_pb_p90_2.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 85.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "page": 91,
    "activity": 3,
    "disc": 4,
    "track": 51,
    "file": "音频/CD4/cd4_51_Track_51.mp3",
    "source": "cd-track",
    "x": 15.171,
    "y": 13,
    "width": 5.56,
    "height": 5.25
  },
  {
    "page": 91,
    "activity": 4,
    "disc": 4,
    "track": 52,
    "x": 15.171,
    "y": 85.438,
    "width": 5.56,
    "height": 5.25
  },
  {
    "page": 92,
    "activity": 1,
    "disc": 4,
    "track": 53,
    "file": "音频/U12_pb_p92_1.mp3",
    "source": "page-activity",
    "x": 16.124,
    "y": 20.375,
    "width": 5.56,
    "height": 5.25
  }
];

export const relatedBookAudio: RelatedBookAudio[] = [
  {
    "file": "音频/ab_pag_24_2.mp3",
    "name": "ab_pag_24_2.mp3",
    "unitId": 4,
    "kind": "workbook"
  },
  {
    "file": "音频/ab_pag_25_3.mp3",
    "name": "ab_pag_25_3.mp3",
    "unitId": 4,
    "kind": "workbook"
  },
  {
    "file": "音频/ab_pag_26_5.mp3",
    "name": "ab_pag_26_5.mp3",
    "unitId": 4,
    "kind": "workbook"
  },
  {
    "file": "音频/ab_pag_28_8.mp3",
    "name": "ab_pag_28_8.mp3",
    "unitId": 4,
    "kind": "workbook"
  },
  {
    "file": "音频/ab_pag_28_9.mp3",
    "name": "ab_pag_28_9.mp3",
    "unitId": 4,
    "kind": "workbook"
  },
  {
    "file": "音频/ab_pag_32_1.mp3",
    "name": "ab_pag_32_1.mp3",
    "unitId": 4,
    "kind": "workbook"
  },
  {
    "file": "音频/CD1/cd1_02_Track_02.mp3",
    "name": "cd1_02_Track_02.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_03_Track_03.mp3",
    "name": "cd1_03_Track_03.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_04_Track_04.mp3",
    "name": "cd1_04_Track_04.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_05_Track_05.mp3",
    "name": "cd1_05_Track_05.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_06_Track_06.mp3",
    "name": "cd1_06_Track_06.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_08_Track_08.mp3",
    "name": "cd1_08_Track_08.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_09_Track_09.mp3",
    "name": "cd1_09_Track_09.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_12_Track_12.mp3",
    "name": "cd1_12_Track_12.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_15_Track_15.mp3",
    "name": "cd1_15_Track_15.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_17_Track_17.mp3",
    "name": "cd1_17_Track_17.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_18_Track_18.mp3",
    "name": "cd1_18_Track_18.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_19_Track_19.mp3",
    "name": "cd1_19_Track_19.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_20_Track_20.mp3",
    "name": "cd1_20_Track_20.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_21_Track_21.mp3",
    "name": "cd1_21_Track_21.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_22_Track_22.mp3",
    "name": "cd1_22_Track_22.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_23_Track_23.mp3",
    "name": "cd1_23_Track_23.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_24_Track_24.mp3",
    "name": "cd1_24_Track_24.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_26_Track_26.mp3",
    "name": "cd1_26_Track_26.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_30_Track_30.mp3",
    "name": "cd1_30_Track_30.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_31_Track_31.mp3",
    "name": "cd1_31_Track_31.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_33_Track_33.mp3",
    "name": "cd1_33_Track_33.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_34_Track_34.mp3",
    "name": "cd1_34_Track_34.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_36_Track_36.mp3",
    "name": "cd1_36_Track_36.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_37_Track_37.mp3",
    "name": "cd1_37_Track_37.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_38_Track_38.mp3",
    "name": "cd1_38_Track_38.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_39_Track_39.mp3",
    "name": "cd1_39_Track_39.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_40_Track_40.mp3",
    "name": "cd1_40_Track_40.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_41_Track_41.mp3",
    "name": "cd1_41_Track_41.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_44_Track_44.mp3",
    "name": "cd1_44_Track_44.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_49_Track_49.mp3",
    "name": "cd1_49_Track_49.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_51_Track_51.mp3",
    "name": "cd1_51_Track_51.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD1/cd1_52_Track_52.mp3",
    "name": "cd1_52_Track_52.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/08_track_08.mp3",
    "name": "08_track_08.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/19_track_19.mp3",
    "name": "19_track_19.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_22_Track_22.mp3",
    "name": "cd2_22_Track_22.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_23_Track_ 23.mp3",
    "name": "cd2_23_Track_ 23.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_26_Track_26.mp3",
    "name": "cd2_26_Track_26.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_28_Track_28.mp3",
    "name": "cd2_28_Track_28.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_29_Track_29.mp3",
    "name": "cd2_29_Track_29.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_30_Track_30.mp3",
    "name": "cd2_30_Track_30.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_31_Track_31.mp3",
    "name": "cd2_31_Track_31.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_32_Track_32.mp3",
    "name": "cd2_32_Track_32.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_33_Track_33.mp3",
    "name": "cd2_33_Track_33.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_35_Track_35.mp3",
    "name": "cd2_35_Track_35.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_38_Track_38.mp3",
    "name": "cd2_38_Track_38.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_39_Track_39.mp3",
    "name": "cd2_39_Track_39.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_40_Track_40.mp3",
    "name": "cd2_40_Track_40.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_41_Track_41.mp3",
    "name": "cd2_41_Track_41.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_42_Track_42.mp3",
    "name": "cd2_42_Track_42.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_43_Track_43.mp3",
    "name": "cd2_43_Track_43.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_45_Track_45.mp3",
    "name": "cd2_45_Track_45.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_46_Track_46.mp3",
    "name": "cd2_46_Track_46.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_52_Track_52.mp3",
    "name": "cd2_52_Track_52.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_54_Track_54.mp3",
    "name": "cd2_54_Track_54.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_55_Track_55.mp3",
    "name": "cd2_55_Track_55.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_56_Track_56.mp3",
    "name": "cd2_56_Track_56.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/cd2_57_Track_57.mp3",
    "name": "cd2_57_Track_57.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD2/u4_pb_p25_4.mp3",
    "name": "u4_pb_p25_4.mp3",
    "unitId": 4,
    "kind": "pupil"
  },
  {
    "file": "音频/CD2/u4_pb_p30_1.mp3",
    "name": "u4_pb_p30_1.mp3",
    "unitId": 4,
    "kind": "pupil"
  },
  {
    "file": "音频/CD3/cd3_02_Track_02.mp3",
    "name": "cd3_02_Track_02.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_03_Track_03.mp3",
    "name": "cd3_03_Track_03.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_05_Track_05.mp3",
    "name": "cd3_05_Track_05.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_06_Track_06.mp3",
    "name": "cd3_06_Track_06.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_09_Track_09.mp3",
    "name": "cd3_09_Track_09.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_13_Track_13.mp3",
    "name": "cd3_13_Track_13.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_15_Track_15.mp3",
    "name": "cd3_15_Track_15.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_16_Track_16.mp3",
    "name": "cd3_16_Track_16.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_17_Track_17.mp3",
    "name": "cd3_17_Track_17.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_18_Track_18.mp3",
    "name": "cd3_18_Track_18.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_19_Track_19.mp3",
    "name": "cd3_19_Track_19.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_21_Track_21.mp3",
    "name": "cd3_21_Track_21.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_24_Track_24.mp3",
    "name": "cd3_24_Track_24.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_28_Track_28.mp3",
    "name": "cd3_28_Track_28.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_29_Track_29.mp3",
    "name": "cd3_29_Track_29.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_30_Track_30.mp3",
    "name": "cd3_30_Track_30.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_31_Track_31.mp3",
    "name": "cd3_31_Track_31.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_32_Track_32.mp3",
    "name": "cd3_32_Track_32.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_34_Track_34.mp3",
    "name": "cd3_34_Track_34.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_35_Track_35.mp3",
    "name": "cd3_35_Track_35.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_36_Track_36.mp3",
    "name": "cd3_36_Track_36.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_38_Track_38.mp3",
    "name": "cd3_38_Track_38.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_39_Track_39.mp3",
    "name": "cd3_39_Track_39.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_40_Track_40.mp3",
    "name": "cd3_40_Track_40.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_41_Track_41.mp3",
    "name": "cd3_41_Track_41.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_46_Track_46.mp3",
    "name": "cd3_46_Track_46.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_47_Track_47.mp3",
    "name": "cd3_47_Track_47.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_48_Track_48.mp3",
    "name": "cd3_48_Track_48.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_50_Track_50.mp3",
    "name": "cd3_50_Track_50.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD3/cd3_51_Track_51.mp3",
    "name": "cd3_51_Track_51.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_02_Track_02.mp3",
    "name": "cd4_02_Track_02.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_03_Track_03.mp3",
    "name": "cd4_03_Track_03.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_05_Track_05.mp3",
    "name": "cd4_05_Track_05.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_06_Track_06.mp3",
    "name": "cd4_06_Track_06.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_07_Track_07.mp3",
    "name": "cd4_07_Track_07.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_08_Track_08.mp3",
    "name": "cd4_08_Track_08.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_09_Track_09.mp3",
    "name": "cd4_09_Track_09.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_12_Track_12.mp3",
    "name": "cd4_12_Track_12.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_15_Track_15.mp3",
    "name": "cd4_15_Track_15.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_16_Track_16.mp3",
    "name": "cd4_16_Track_16.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_17_Track_17.mp3",
    "name": "cd4_17_Track_17.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_19_Track_19.mp3",
    "name": "cd4_19_Track_19.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_20_Track_20.mp3",
    "name": "cd4_20_Track_20.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_21_Track_21.mp3",
    "name": "cd4_21_Track_21.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_22_Track_22.mp3",
    "name": "cd4_22_Track_22.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_23_Track_23.mp3",
    "name": "cd4_23_Track_23.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_25_Track_25.mp3",
    "name": "cd4_25_Track_25.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_26_Track_26.mp3",
    "name": "cd4_26_Track_26.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_27_Track_27.mp3",
    "name": "cd4_27_Track_27.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_28_Track_28.mp3",
    "name": "cd4_28_Track_28.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_31_Track_31.mp3",
    "name": "cd4_31_Track_31.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_32_Track_32.mp3",
    "name": "cd4_32_Track_32.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_33_Track_33.mp3",
    "name": "cd4_33_Track_33.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_34_Track_34.mp3",
    "name": "cd4_34_Track_34.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_37_Track_37.mp3",
    "name": "cd4_37_Track_37.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_39_Track_39.mp3",
    "name": "cd4_39_Track_39.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_40_Track_40.mp3",
    "name": "cd4_40_Track_40.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_42_Track_42.mp3",
    "name": "cd4_42_Track_42.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_48_Track_48.mp3",
    "name": "cd4_48_Track_48.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_49_Track_49.mp3",
    "name": "cd4_49_Track_49.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/CD4/cd4_51_Track_51.mp3",
    "name": "cd4_51_Track_51.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/extras/10a_unit10_unit_test_audio.mp3",
    "name": "10a_unit10_unit_test_audio.mp3",
    "unitId": 10,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/10b_trb_unit_10_song.mp3",
    "name": "10b_trb_unit_10_song.mp3",
    "unitId": 10,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/10c_trb_unit_10_ext_2.mp3",
    "name": "10c_trb_unit_10_ext_2.mp3",
    "unitId": 10,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/11a_trb_unit_11_song.mp3",
    "name": "11a_trb_unit_11_song.mp3",
    "unitId": 11,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/11b_trb_unit_11_ext_2.mp3",
    "name": "11b_trb_unit_11_ext_2.mp3",
    "unitId": 11,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/12a_unit_12_unit_test_audio.mp3",
    "name": "12a_unit_12_unit_test_audio.mp3",
    "unitId": 12,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/12b_end_of_level_test_audio.mp3",
    "name": "12b_end_of_level_test_audio.mp3",
    "unitId": 12,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/12c_yle_unit_test_12.mp3",
    "name": "12c_yle_unit_test_12.mp3",
    "unitId": 12,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/12d_yle_review_11_12.mp3",
    "name": "12d_yle_review_11_12.mp3",
    "unitId": 12,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/12f_trb_test_9_12_ex1.mp3",
    "name": "12f_trb_test_9_12_ex1.mp3",
    "unitId": 12,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/12g_trb_test_9_12_ex2.mp3",
    "name": "12g_trb_test_9_12_ex2.mp3",
    "unitId": 12,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/12h_trb_test_9_12_ex3.mp3",
    "name": "12h_trb_test_9_12_ex3.mp3",
    "unitId": 12,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/12i_trb_test_9_12_ex4.mp3",
    "name": "12i_trb_test_9_12_ex4.mp3",
    "unitId": 12,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/12j_trb_test_end_of_year_ex1.mp3",
    "name": "12j_trb_test_end_of_year_ex1.mp3",
    "unitId": 12,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/12k_trb_test_end_of_year_ex2.mp3",
    "name": "12k_trb_test_end_of_year_ex2.mp3",
    "unitId": 12,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/12l_trb_test_end_of_year_ex3.mp3",
    "name": "12l_trb_test_end_of_year_ex3.mp3",
    "unitId": 12,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/12m_trb_test_end_of_year_ex4.mp3",
    "name": "12m_trb_test_end_of_year_ex4.mp3",
    "unitId": 12,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/12n_trb_unit_12_song.mp3",
    "name": "12n_trb_unit_12_song.mp3",
    "unitId": 12,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/12o_trb_unit_12_ext_2.mp3",
    "name": "12o_trb_unit_12_ext_2.mp3",
    "unitId": 12,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/1a_unit_1_unit_test.mp3",
    "name": "1a_unit_1_unit_test.mp3",
    "unitId": 1,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/1b_trb_unit_1_song.mp3",
    "name": "1b_trb_unit_1_song.mp3",
    "unitId": 1,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/1c_trb_unit_1_ext_2.mp3",
    "name": "1c_trb_unit_1_ext_2.mp3",
    "unitId": 1,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/2a_unit_2_unit_test.mp3",
    "name": "2a_unit_2_unit_test.mp3",
    "unitId": 2,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/2b_trb_unit_2_song.mp3",
    "name": "2b_trb_unit_2_song.mp3",
    "unitId": 2,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/2c_trb_unit_2_ext_2.mp3",
    "name": "2c_trb_unit_2_ext_2.mp3",
    "unitId": 2,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/3a_unit_3_unit_test.mp3",
    "name": "3a_unit_3_unit_test.mp3",
    "unitId": 3,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/3b_yle_unit_test_3.mp3",
    "name": "3b_yle_unit_test_3.mp3",
    "unitId": 3,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/3c_trb_unit_3_song.mp3",
    "name": "3c_trb_unit_3_song.mp3",
    "unitId": 3,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/3d_trb_unit_3_ext_2.mp3",
    "name": "3d_trb_unit_3_ext_2.mp3",
    "unitId": 3,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/4a_unit_4_unit_test.mp3",
    "name": "4a_unit_4_unit_test.mp3",
    "unitId": 4,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/4b_unit_1_4_review_test.mp3",
    "name": "4b_unit_1_4_review_test.mp3",
    "unitId": 4,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/4c_trb_test_1_4_ex1.mp3",
    "name": "4c_trb_test_1_4_ex1.mp3",
    "unitId": 4,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/4d_trb_test_1_4_ex2.mp3",
    "name": "4d_trb_test_1_4_ex2.mp3",
    "unitId": 4,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/4e_trb_test_1_4_ex3.mp3",
    "name": "4e_trb_test_1_4_ex3.mp3",
    "unitId": 4,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/4f_trb_unit_4_song.mp3",
    "name": "4f_trb_unit_4_song.mp3",
    "unitId": 4,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/4g_trb_unit_4_ext_2.mp3",
    "name": "4g_trb_unit_4_ext_2.mp3",
    "unitId": 4,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/5a_unit_5_unit_test.mp3",
    "name": "5a_unit_5_unit_test.mp3",
    "unitId": 5,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/5b_trb_unit_5_song.mp3",
    "name": "5b_trb_unit_5_song.mp3",
    "unitId": 5,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/5c_trb_unit_5_ext_2.mp3",
    "name": "5c_trb_unit_5_ext_2.mp3",
    "unitId": 5,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/6a_trb_unit_6_song.mp3",
    "name": "6a_trb_unit_6_song.mp3",
    "unitId": 6,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/6b_trb_unit_6_ext_2.mp3",
    "name": "6b_trb_unit_6_ext_2.mp3",
    "unitId": 6,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/7a_yle_unit_test_7.mp3",
    "name": "7a_yle_unit_test_7.mp3",
    "unitId": 7,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/7b_trb_unit_7_song.mp3",
    "name": "7b_trb_unit_7_song.mp3",
    "unitId": 7,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/7c_trb_unit_7_ext_2.mp3",
    "name": "7c_trb_unit_7_ext_2.mp3",
    "unitId": 7,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/8a_unit_8_unit_test.mp3",
    "name": "8a_unit_8_unit_test.mp3",
    "unitId": 8,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/8b_unit_5_8_review_test.mp3",
    "name": "8b_unit_5_8_review_test.mp3",
    "unitId": 8,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/8c_yle_unit_test_8.mp3",
    "name": "8c_yle_unit_test_8.mp3",
    "unitId": 8,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/8d_trb_test_5_8_ex1.mp3",
    "name": "8d_trb_test_5_8_ex1.mp3",
    "unitId": 8,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/8e_trb_test_5_8_ex2.mp3",
    "name": "8e_trb_test_5_8_ex2.mp3",
    "unitId": 8,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/8f_trb_test_5_8_ex3.mp3",
    "name": "8f_trb_test_5_8_ex3.mp3",
    "unitId": 8,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/8g_trb_test_5_8_ex4.mp3",
    "name": "8g_trb_test_5_8_ex4.mp3",
    "unitId": 8,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/8h_trb_unit_8_song.mp3",
    "name": "8h_trb_unit_8_song.mp3",
    "unitId": 8,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/8i_trb_unit_8_ext_2.mp3",
    "name": "8i_trb_unit_8_ext_2.mp3",
    "unitId": 8,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/9a_trb_unit_9_song.mp3",
    "name": "9a_trb_unit_9_song.mp3",
    "unitId": 9,
    "kind": "teacher"
  },
  {
    "file": "音频/extras/9b_trb_unit_9_ext_2.mp3",
    "name": "9b_trb_unit_9_ext_2.mp3",
    "unitId": 9,
    "kind": "teacher"
  },
  {
    "file": "音频/Page 55_ Ex_3.mp3",
    "name": "Page 55_ Ex_3.mp3",
    "unitId": null,
    "kind": "disc"
  },
  {
    "file": "音频/pb_pag_26_6.mp3",
    "name": "pb_pag_26_6.mp3",
    "unitId": 4,
    "kind": "pupil"
  },
  {
    "file": "音频/pb_pag_27_7.mp3",
    "name": "pb_pag_27_7.mp3",
    "unitId": 4,
    "kind": "pupil"
  },
  {
    "file": "音频/pb_pag_27_8.mp3",
    "name": "pb_pag_27_8.mp3",
    "unitId": 4,
    "kind": "pupil"
  },
  {
    "file": "音频/pb_pag_28_10.mp3",
    "name": "pb_pag_28_10.mp3",
    "unitId": 4,
    "kind": "pupil"
  },
  {
    "file": "音频/pb_pag_28_9.mp3",
    "name": "pb_pag_28_9.mp3",
    "unitId": 4,
    "kind": "pupil"
  },
  {
    "file": "音频/pb_pag_29_11.mp3",
    "name": "pb_pag_29_11.mp3",
    "unitId": 4,
    "kind": "pupil"
  },
  {
    "file": "音频/pb_pag_31_3.mp3",
    "name": "pb_pag_31_3.mp3",
    "unitId": 4,
    "kind": "pupil"
  },
  {
    "file": "音频/pb_pag_33_3.mp3",
    "name": "pb_pag_33_3.mp3",
    "unitId": 4,
    "kind": "pupil"
  },
  {
    "file": "音频/U10_ab_p70_2.mp3",
    "name": "U10_ab_p70_2.mp3",
    "unitId": 10,
    "kind": "workbook"
  },
  {
    "file": "音频/U10_pb_p73_7.mp3",
    "name": "U10_pb_p73_7.mp3",
    "unitId": 10,
    "kind": "pupil"
  },
  {
    "file": "音频/U10_pb_p74_10.mp3",
    "name": "U10_pb_p74_10.mp3",
    "unitId": 10,
    "kind": "pupil"
  },
  {
    "file": "音频/U10_pb_p74_9.mp3",
    "name": "U10_pb_p74_9.mp3",
    "unitId": 10,
    "kind": "pupil"
  },
  {
    "file": "音频/U10_pb_p75_12.mp3",
    "name": "U10_pb_p75_12.mp3",
    "unitId": 10,
    "kind": "pupil"
  },
  {
    "file": "音频/U11_pb_p79_3.mp3",
    "name": "U11_pb_p79_3.mp3",
    "unitId": 11,
    "kind": "pupil"
  },
  {
    "file": "音频/U11_pb_p81_7.mp3",
    "name": "U11_pb_p81_7.mp3",
    "unitId": 11,
    "kind": "pupil"
  },
  {
    "file": "音频/U12_ab_p87_7.mp3",
    "name": "U12_ab_p87_7.mp3",
    "unitId": 12,
    "kind": "workbook"
  },
  {
    "file": "音频/U12_pb_p84_1.mp3",
    "name": "U12_pb_p84_1.mp3",
    "unitId": 12,
    "kind": "pupil"
  },
  {
    "file": "音频/U12_pb_p84_2.mp3",
    "name": "U12_pb_p84_2.mp3",
    "unitId": 12,
    "kind": "pupil"
  },
  {
    "file": "音频/U12_pb_p86_6.mp3",
    "name": "U12_pb_p86_6.mp3",
    "unitId": 12,
    "kind": "pupil"
  },
  {
    "file": "音频/U12_pb_p87_7.mp3",
    "name": "U12_pb_p87_7.mp3",
    "unitId": 12,
    "kind": "pupil"
  },
  {
    "file": "音频/U12_pb_p88_10.mp3",
    "name": "U12_pb_p88_10.mp3",
    "unitId": 12,
    "kind": "pupil"
  },
  {
    "file": "音频/U12_pb_p88_9.mp3",
    "name": "U12_pb_p88_9.mp3",
    "unitId": 12,
    "kind": "pupil"
  },
  {
    "file": "音频/U12_pb_p90_2.mp3",
    "name": "U12_pb_p90_2.mp3",
    "unitId": 12,
    "kind": "pupil"
  },
  {
    "file": "音频/U12_pb_p92_1.mp3",
    "name": "U12_pb_p92_1.mp3",
    "unitId": 12,
    "kind": "pupil"
  },
  {
    "file": "音频/U3_ab_p22_9.mp3",
    "name": "U3_ab_p22_9.mp3",
    "unitId": 3,
    "kind": "workbook"
  },
  {
    "file": "音频/u4_pb_p12_6.mp3",
    "name": "u4_pb_p12_6.mp3",
    "unitId": 2,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p13_8.mp3",
    "name": "u4_pb_p13_8.mp3",
    "unitId": 2,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p14_9.mp3",
    "name": "u4_pb_p14_9.mp3",
    "unitId": 2,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p15_11.mp3",
    "name": "u4_pb_p15_11.mp3",
    "unitId": 2,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p20_5.mp3",
    "name": "u4_pb_p20_5.mp3",
    "unitId": 3,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p20_6.mp3",
    "name": "u4_pb_p20_6.mp3",
    "unitId": 3,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p21_7.mp3",
    "name": "u4_pb_p21_7.mp3",
    "unitId": 3,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p22_9.mp3",
    "name": "u4_pb_p22_9.mp3",
    "unitId": 3,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p24_1.mp3",
    "name": "u4_pb_p24_1.mp3",
    "unitId": 4,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p24_2.mp3",
    "name": "u4_pb_p24_2.mp3",
    "unitId": 4,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p34_2.mp3",
    "name": "u4_pb_p34_2.mp3",
    "unitId": 5,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p37_7.mp3",
    "name": "u4_pb_p37_7.mp3",
    "unitId": 5,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p38_9.mp3",
    "name": "u4_pb_p38_9.mp3",
    "unitId": 5,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p41_4.mp3",
    "name": "u4_pb_p41_4.mp3",
    "unitId": 6,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p42_6.mp3",
    "name": "u4_pb_p42_6.mp3",
    "unitId": 6,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p43_7.mp3",
    "name": "u4_pb_p43_7.mp3",
    "unitId": 6,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p44_9.mp3",
    "name": "u4_pb_p44_9.mp3",
    "unitId": 6,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p50_6.mp3",
    "name": "u4_pb_p50_6.mp3",
    "unitId": 7,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p51_7.mp3",
    "name": "u4_pb_p51_7.mp3",
    "unitId": 7,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p52_9.mp3",
    "name": "u4_pb_p52_9.mp3",
    "unitId": 7,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p53_11.mp3",
    "name": "u4_pb_p53_11.mp3",
    "unitId": 7,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p56_6.mp3",
    "name": "u4_pb_p56_6.mp3",
    "unitId": 8,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p57_7.mp3",
    "name": "u4_pb_p57_7.mp3",
    "unitId": 8,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p57_8.mp3",
    "name": "u4_pb_p57_8.mp3",
    "unitId": 8,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p60_1.mp3",
    "name": "u4_pb_p60_1.mp3",
    "unitId": 8,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p65_4.mp3",
    "name": "u4_pb_p65_4.mp3",
    "unitId": 9,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p66_5.mp3",
    "name": "u4_pb_p66_5.mp3",
    "unitId": 9,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p66_6.mp3",
    "name": "u4_pb_p66_6.mp3",
    "unitId": 9,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p68_9.mp3",
    "name": "u4_pb_p68_9.mp3",
    "unitId": 9,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p6_5.mp3",
    "name": "u4_pb_p6_5.mp3",
    "unitId": 1,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p7_7.mp3",
    "name": "u4_pb_p7_7.mp3",
    "unitId": 1,
    "kind": "pupil"
  },
  {
    "file": "音频/u4_pb_p8_9.mp3",
    "name": "u4_pb_p8_9.mp3",
    "unitId": 1,
    "kind": "pupil"
  },
  {
    "file": "音频/U6_ab_p42_5.mp3",
    "name": "U6_ab_p42_5.mp3",
    "unitId": 6,
    "kind": "workbook"
  },
  {
    "file": "音频/U6_ab_p44_9.mp3",
    "name": "U6_ab_p44_9.mp3",
    "unitId": 6,
    "kind": "workbook"
  },
  {
    "file": "音频/U7_ab_p48_1.mp3",
    "name": "U7_ab_p48_1.mp3",
    "unitId": 7,
    "kind": "workbook"
  },
  {
    "file": "音频/U8_ab_p56_5.mp3",
    "name": "U8_ab_p56_5.mp3",
    "unitId": 8,
    "kind": "workbook"
  },
  {
    "file": "音频/U8_ab_p62_1.mp3",
    "name": "U8_ab_p62_1.mp3",
    "unitId": 8,
    "kind": "workbook"
  }
];

export function findBookAudio(page: number, activity: number) { return bookAudioReferences.find(ref => ref.page === page && ref.activity === activity); }
