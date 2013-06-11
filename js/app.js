// Create AngularJS module.
var finances = angular.module('finances', ['firebase']);

// Create controllers and bind them to the module.
var controllers = {};
controllers.DashboardController = function($scope, $timeout, angularFireCollection) {
    $scope.expenses = [];
    $scope.maxNumberOfExpenses = 50;
    $scope.firebaseUrl = 'https://kfr2.firebaseio-demo.com/expenses';

    $scope.getExpenses = function() {
        if ((angular.isNumber($scope.maxNumberOfExpenses)) && ($scope.maxNumberOfExpenses > 0)) {
            $scope.expenses = angularFireCollection(new Firebase($scope.firebaseUrl).limit($scope.maxNumberOfExpenses));
        }
    };

    $scope.addExpense = function() {
        if ($scope.newExpense === undefined) { return; }
        if ($scope.newExpense.amount === undefined) { return; }
        if ($scope.newExpense.tags === undefined) { return; }

        if (isNaN(parseFloat($scope.newExpense.amount))) { return; }

        var today = new Date();
        var newExpense = $scope.newExpense;
        $scope.expenses.add({
            date: today.toISOString(),
            amount: newExpense.amount,
            tags: newExpense.tags
        });
        $scope.newExpense = null;
    };

    $scope.updateExpense = function(expense) {
        $scope.expenses.update(expense);
    };

    $scope.removeExpense = function(expense) {
        if (confirm('Are you sure you want to remove this expense?')) {
            $scope.expenses.remove(expense);
        }
    };

    $scope.totalExpenseAmount = function() {
        var sum = 0;
        for (var i = 0, v; v = $scope.expenses[i]; i++) {
            if (v.amount !== '') {
                sum += parseFloat(v.amount);
            }
        }
        return sum;
    };

    $scope.editExpense = function(expense) {
        expense.editing = true;
    };

    $scope.saveExpense = function(expense) {
        expense.editing = false;
        $scope.updateExpense(expense);
    };

    function init() {
        $scope.getExpenses();
    }
    init();
};
controllers.StatsController = function($scope) {
    // Stats stuff.
};

// Define routes for the module.
finances.config(function($routeProvider) {
     $routeProvider
          .when('/dashboard', {controller: controllers.DashboardController, templateUrl: 'partials/dashboard.html'})
          //.when('/details', {controller: 'DetailsController', templateUrl: 'partials/details.html'})
          .when('/stats', {controller: controllers.StatsController, templateUrl: 'partials/stats.html'})
          .otherwise({redirectTo: '/dashboard'});
});