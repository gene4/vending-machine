// function giveBackChange(productCost: number): number[] {
//     const allowedCoins = [100, 50, 20, 10, 5];
//     const result: number[] = [];

//     while (productCost > 0) {
//         for (const coin of allowedCoins) {
//             if (productCost >= coin) {
//                 result.push(coin);
//                 productCost -= coin;
//                 break;
//             }
//         }
//     }

//     return result;
// }

const giveBackChange = (productCost) => {
    const allowedCoins = [100, 50, 20, 10, 5];
    const result = [];

    while (productCost > 0) {
        for (const coin of allowedCoins) {
            if (productCost >= coin) {
                result.push(coin);
                productCost -= coin;
                break;
            }
        }
    }

    return result;
};

module.exports.giveBackChange = giveBackChange;
