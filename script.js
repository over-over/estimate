$(function(){ 'use strict';

    var Estimate = function(el){
        
        this.element = el;
        this.lamp = el.find(".js-lamp");
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
            elevatorDemand: 0.4,
            elevatorFreqInstallCost: 27000,
            elevatorFreqCost: 10000,
            detectorRadius: 6,
            newPowerFactor: 0.6,
            oldPowerFactor: 0.98
        }

        this.final = 0;
        this.bindEvents();
    }

    Estimate.prototype = {

        bindEvents: function(){

            var inst = this;

            $(".js-form").on("submit", function(e){

                e.preventDefault();
                inst.estimateLamps();
                inst.estimateDetectors();
                inst.estimateTriggers();
                
                if(inst.elevator.prop("checked")){
                    inst.estimateElevator();
                    inst.final = inst.final/4;
                }else{
                    inst.final = inst.final/3;
                }
                $(".js-final").text(inst.final.toFixed(2));
                $(".js-final-text").show();
            });

            this.floors.on("input", function(){
                
                if(+$(this).val() > 1){
                    inst.elevator.prop('disabled', false);
                    inst.stairway.prop('disabled', false);
                } else {
                    inst.elevator.prop('disabled', true);
                    inst.stairway.prop('disabled', true);
                }
            })
        },
        estimateLamps: function(){
            var area = (+this.corridor.val() + +this.office.val() + +this.service.val()) * +this.floors.val();
            if(+this.floors.val() > 1){ area += (+this.stairway.val() - 1) * +this.floors.val() }
            var lamps = Math.round(area / this.const.newLampRadius);
            console.log(area, lamps, (this.const.oldLampPower/1000 - this.const.newLampPower/1000));
            var yearPower = (+this.lamp.val()/1000 - this.const.newLampPower/1000) * lamps * 365 * 24 * this.const.demand;
            var yearSave = yearPower * this.const.powerCost;
            var cost = (this.const.lampInstallCost + this.const.newLampCost) * lamps;
            var time = cost/yearSave;
            $(".js-lamp-full").text(yearPower.toFixed(2));
            $(".js-lamp-save").text(yearSave.toFixed(2));
            $(".js-lamp-cost").text(cost.toFixed(2));
            $(".js-lamp-time").text(time.toFixed(2));

            this.final += time;
            $(".js-lamp-results").show();
        },
        estimateTriggers: function(){
            
            var area = (+this.corridor.val() + +this.office.val() + +this.service.val()) * +this.floors.val();
            if(+this.floors.val() > 1){ area += (+this.stairway.val() - 1) * +this.floors.val() }
            var lamps = Math.round(area / this.const.newLampRadius);
            var year = 0.08 * (this.const.oldPowerFactor - this.const.newPowerFactor) * lamps * 8760 * this.const.newPowerFactor;
            var yearSave = year * this.const.powerCost;
            var installCost = 1100 * lamps * 2;
            var time = installCost / yearSave;
            $(".js-trigger-save-amount").text(year.toFixed(2));
            $(".js-trigger-save-cost").text(yearSave.toFixed(2));
            $(".js-trigger-cost").text(installCost.toFixed(2));
            $(".js-trigger-time").text(time.toFixed(2));

            this.final += time;
            $(".js-trigger-results").show();
        },
        estimateDetectors: function(){
            
            var detectorsAmount = Math.round( +this.corridor.val() / this.const.detectorRadius ) * +this.floors.val();
            var lampsAmount = Math.round(+this.corridor.val() / this.const.newLampRadius) * +this.floors.val();
            var yearCostWithout = this.const.newLampPower * lampsAmount * 10 * 365;
            var yearCostWith = this.const.newLampPower * lampsAmount * 5 * 365;
            var yearSaveAmount = yearCostWithout - yearCostWith;
            var yearSaveCost = 2800 * detectorsAmount;
            var time = yearSaveCost / yearSaveAmount;
            $(".js-detector-without").text(yearCostWithout.toFixed(2));
            $(".js-detector-with").text(yearCostWith.toFixed(2));
            $(".js-detector-save-amount").text(yearSaveAmount.toFixed(2));
            $(".js-detector-save-cost").text(yearSaveCost.toFixed(2));
            $(".js-detector-time").text(time.toFixed(2));

            this.final += time;
            $(".js-detector-results").show();
        },
        estimateElevator: function(){
            
            var year = 75000 * this.const.elevatorDemand;
            var yearSave = year * this.const.powerCost;
            var cost = this.const.elevatorFreqInstallCost + this.const.elevatorFreqCost;
            var time = cost/yearSave;
            $(".js-elevator-full").text(year.toFixed(2));
            $(".js-elevator-save").text(yearSave.toFixed(2));
            $(".js-elevator-cost").text(cost.toFixed(2));
            $(".js-elevator-time").text(time.toFixed(2));

            this.final += time;
            $(".js-elevator-results").show();
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