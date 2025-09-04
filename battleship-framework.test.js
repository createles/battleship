import { Gameboard } from "./battleship-data";

describe("test gameboard generation", () => {
  test("creates 2 gameboards with 10 tiles", () => {
    const gameboardA = new Gameboard();
    expect(gameboardA.shipGrid).toEqual([[null,null,null,null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,null,null,null,]]
    );
    expect(gameboardA.attackGrid).toEqual([[null,null,null,null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,null,null,null,]]
    );
  })
});
