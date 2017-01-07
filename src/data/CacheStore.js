Ext.define('GreatHelper.data.CacheStore',{
    extend: 'Ext.data.Store',

    /*
    * CacheWay
    * values : version | timestamp(second)
    */
    cacheWay: 'version',

    listeners: {
        beforeload: function () {
            var me = this,
                id = 'cachestore-' + me.storeId,
                cacheWay = me.cacheWay,
                cacheLoaderKey = cacheWay === 'version' ? Ext.Microloader.manifest.content.loader.cache : Ext.Date.add(new Date(), Ext.Date.SECOND, Number(cacheWay)),
                storage = Ext.util.LocalStorage.get(id);
            if (!storage)
                storage = new Ext.util.LocalStorage({ id: id });

            var savedKey = storage.getItem('key'),
                cacheAlive = (cacheWay === 'version' && savedKey === cacheLoaderKey) ||
                (Ext.Date.diff(new Date(savedKey), new Date(Date.now()), 's') <= 0);

            if (cacheAlive) {
                me.setData(JSON.parse(storage.getItem('data')));
                return false;
            } else {
                storage.setItem('key', cacheLoaderKey);
                storage.setItem('data', '[]');
            }

            return true;
        },
        load: function (store, records, successful) {
            var id = 'cachestore-' + this.storeId,
                storage = Ext.util.LocalStorage.get(id);

            if (successful) {
                storage.setItem('data', JSON.stringify(records.map(function (x) { return x.data; })));
            }
        }
    }
});
