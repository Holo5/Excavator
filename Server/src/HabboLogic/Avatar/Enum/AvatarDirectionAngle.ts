export class AvatarDirectionAngle {
  public static ANGLE_DEGREE = [45, 90, 135, 180, 225, 270, 315, 0];
  public static MISSING_ANGLE = [false, false, false, false, true, true, true, false];
  public static MIN_ANGLE = 0;
  public static MAX_ANGLE = 7;
  public static GESTURE_DATA = {
    sit: { direction: [0, 2, 4, 6], framesCount: 1 },
    std: { direction: [0, 1, 2, 3, 4, 5, 6, 7], framesCount: 1 },
    wlk: { direction: [0, 1, 2, 3, 4, 5, 6, 7], framesCount: 4 },
    lay: { direction: [2, 4], framesCount: 1 },
    lsb: { direction: [2, 4], framesCount: 1 },
    spk: { direction: [0, 1, 2, 3, 4, 5, 6, 7], framesCount: 2 },
    lsp: { direction: [], framesCount: 0 },
    lag: { direction: [], framesCount: 0 },
    lsa: { direction: [], framesCount: 0 },
    lsm: { direction: [], framesCount: 0 },
    lsr: { direction: [], framesCount: 0 },
    ley: { direction: [], framesCount: 0 },
    wav: { direction: [0, 1, 2, 3, 4, 5, 6, 7], framesCount: 2 },
    crr: { direction: [0, 1, 2, 3, 4, 5, 6, 7], framesCount: 1 },
    drk: { direction: [0, 1, 2, 3, 4, 5, 6, 7], framesCount: 1 },
    sad: { direction: [1, 2, 3, 4, 5], framesCount: 1 },
    sml: { direction: [1, 2, 3, 4, 5], framesCount: 1 },
    agr: { direction: [1, 2, 3, 4, 5], framesCount: 1 },
    srp: { direction: [1, 2, 3, 4, 5], framesCount: 1 },
    joy: { direction: [1, 2, 3, 4, 5], framesCount: 1 },
    crz: { direction: [1, 2, 3, 4, 5], framesCount: 1 },
    eyb: { direction: [1, 2, 3, 4, 5], framesCount: 1 },
    blw: { direction: [1, 2, 3, 4, 5], framesCount: 1 },
  };
}
