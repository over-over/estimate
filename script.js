$(function(){ 'use strict';

    var Estimate = function(el){
        
        this.element = el;
        this.corridor = el.find(".js-corridor");
        this.office = el.find(".js-office");
        this.service = el.find(".js-service");
        this.floors = el.find(".js-floors");
        this.elevator = el.find(".js-elevator");
        this.stairway = el.find(".js-stairway");

        this.const = {
            oldLampPower: 50,
            newLampPower: 16,
            newLampRadius: 6,
            newLampCost: 110,
            lampInstallCost: 80,
            powerCost: 3.97,
            demand: 0.75,
        }

        this.bindEvents();
    }

    Estimate.prototype = {

        bindEvents: function(){

            var inst = this;

            $(".js-btn").on("click", function(){
                inst.estimateLamps();
            });
        },
        estimateLamps: function(){
            var area = +this.corridor.val() + +this.office.val() + +this.service.val();
            if(this.floors > 1){ area += this.stairway.val() * this.floors.val() }

            console.log(this.corridor);

            var lamps = Math.round(area / this.const.newLampRadius);
            console.log(area, lamps, (this.const.oldLampPower/1000 - this.const.newLampPower/1000))
            var yearPower = (this.const.oldLampPower/1000 - this.const.newLampPower/1000) * lamps * 365 * 24 * this.const.demand;
            var yearSave = yearPower * this.const.powerCost;
            var cost = (this.const.lampInstallCost + this.const.newLampCost) * lamps;
            var time = cost/yearSave;
            $(".js-lamp-full").text(yearPower.toFixed(2));
            $(".js-lamp-save").text(yearSave.toFixed(2));
            $(".js-lamp-cost").text(cost.toFixed(2));
            $(".js-lamp-time").text(time.toFixed(2));
        }
    }

    function Plugin(option) {
        return $(this).each(function() {
            var $this = $(this);
            var data = $this.data("estimate");
            var options = $.extend({}, null, $this.data(), typeof option == 'object' && option);

            if (!data) $this.data('estimate', (data = new Estimate($(this), options)));

        })
    }

    $.fn.estimate = Plugin;
    $.fn.estimate.Constructor = Estimate;

    $(".js-estimate").estimate();
});