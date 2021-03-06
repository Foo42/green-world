function createInventory(items) {
    var items = items || [];

    function addItemToStack(item) {
        var existing = _.find(items, {
            name: item.name
        })
        if (existing) {
            if (existing.quantity + item.quantity > 64) {
                var newItem = {
                    name: item.name,
                    quantity: existing.quantity + item.quantity - 64
                };
                items.push(newItem);
                existing.quantity = 64;
            } else {
                existing.quantity += item.quantity;
            }
        } else {
            items.push(item)
        }
    }

    function splitIncomingItemsIntoStacks(incoming) {
        var incomingItems = []
        while (incoming.quantity > 64) {
            incomingItems.push({
                name: incoming.name,
                quantity: 64
            });
            incoming.quantity -= 64
        }
        incomingItems.push(incoming);
        return incomingItems;
    }

    function hasEnough(item) {
        var grandTotal = 0;
        grandTotal = _.chain(items)
            .where({
                name: item.name
            })
            .pluck('quantity')
            .reduce(function (total, quantity) {
                return total + quantity;
            })
            .value();
        return grandTotal >= item.quantity;
    }
    return {
        add: function (incoming) {
            _.forEach(splitIncomingItemsIntoStacks(incoming), addItemToStack);

        },
        remove: function (item) {
            if (!hasEnough(item)) return;
            var itemQuantity = item.quantity
            while (itemQuantity > 0) {
                var lowestStackOfItem = _.chain(items)
                    .sortByOrder(['quantity'], ['asc'])
                    .find({
                        'name': item.name
                    })
                    .value();
                if (lowestStackOfItem.quantity >= itemQuantity) {
                    lowestStackOfItem.quantity -= itemQuantity;
                    itemQuantity = 0;
                } else {
                    itemQuantity -= lowestStackOfItem.quantity;
                    lowestStackOfItem.quantity = 0;
                }
                if (lowestStackOfItem.quantity === 0) {
                    _.remove(items, lowestStackOfItem)
                }
            }

        },
        hasEnough: hasEnough,
        getItems: function () {
            items = _.sortByOrder(items, ['name', 'quantity'], ['asc', 'desc']);
            return items
        },
        serialise: function () {
            return items;
        }
    }
}