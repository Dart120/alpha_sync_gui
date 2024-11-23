#include <vector>
#include <iostream>
using namespace std;
void func(const std::vector<int>& coins, int amount_left, int coins_used, int * minimum) {
    if (amount_left == 0) *minimum = std::min(*minimum, coins_used);
    for (auto coin:coins){
        cout << coin << " " << amount_left<<endl;
        if (amount_left - coin >= 0) func(coins, amount_left - coin,coins_used + 1,minimum);
    }
}
int coinChange(const std::vector<int>& coins, int amount) {
    int * minimum;
    *minimum =  INT_MAX;
    func(coins, amount, 0, minimum);
    if (*minimum == INT_MAX) return -1;
    return *minimum;
}


// comment out main() before running tests
int main() {
    // debug your code below
    std::vector<int> coins = {1};
    int amount = 5;
    std::cout << coinChange(coins, amount) << std::endl;
    return 0;
}
