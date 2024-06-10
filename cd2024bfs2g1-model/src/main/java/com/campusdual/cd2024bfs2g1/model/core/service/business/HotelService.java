package com.campusdual.cd2024bfs2g1.model.core.service.business;

import com.campusdual.cd2024bfs2g1.api.core.service.business.IHotelService;
import com.campusdual.cd2024bfs2g1.model.core.dao.business.HotelDao;
import com.campusdual.cd2024bfs2g1.model.core.dao.business.HotelRoomsDao;
import com.campusdual.cd2024bfs2g1.model.core.dao.business.HotelServicesDao;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Lazy
@Service("HotelService")
public class HotelService implements IHotelService {

    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;

    @Autowired
    private HotelDao hotelDao;

    @Autowired
    private HotelServicesDao hotelServicesDao;

    @Autowired
    private HotelRoomsDao hotelRoomsDao;

    @Autowired
    private HotelRoomsService hotelRoomsService;

    @Autowired
    private HotelServicesService hotelServicesService;

    @Override
    public EntityResult hotelQuery(Map<String, Object> keysValues, List<String> attributes) throws OntimizeJEERuntimeException {
        return this.daoHelper.query(this.hotelDao,keysValues, attributes);
    }


    @Override
    public EntityResult hotelMultiQuery(Map<String, Object> keysValues, List<String> attributes) throws OntimizeJEERuntimeException {

        attributes.remove("roomTypeSingle");
        attributes.remove("priceSingleRoom");
        attributes.remove("roomTypeDouble");
        attributes.remove("priceDoubleRoom");
        attributes.remove("roomTypeTriple");
        attributes.remove("priceTripleRoom");
        attributes.remove("toggleWifi");
        attributes.remove("toggleParking");
        attributes.remove("togglePool");
        attributes.remove("toggleBreakfast");
        attributes.remove("toggleLunch");
        attributes.remove("toggleDinner");


        EntityResult er = this.daoHelper.query(this.hotelDao,keysValues, attributes);


        ArrayList <Integer> hotelIdArr = (ArrayList<Integer>) er.get("htl_id");
        int hotelId = hotelIdArr.get(0);


        keysValues.put("htl_id",hotelId);
        keysValues.remove("bsn_id");
        attributes.add("srv_type");
        attributes.remove("bsn_id");

        EntityResult erServ = this.daoHelper.query(this.hotelServicesDao,keysValues, attributes);

        ArrayList <String> serviceList = (ArrayList<String>) erServ.get("srv_type");


        ArrayList <Boolean> bool = new ArrayList<>();
        bool.add(true);

        if(serviceList!=null) {
            for (String service : serviceList) {


                switch (service) {
                    case "Wifi":
                        er.put("toggleWifi", bool);
                        break;
                    case "Parking":
                        er.put("toggleParking", bool);
                        break;
                    case "Pool":
                        er.put("togglePool", bool);
                        break;
                    case "Breakfast":
                        er.put("toggleBreakfast", bool);
                        break;
                    case "Lunch":
                        er.put("toggleLunch", bool);
                        break;
                    case "Dinner":
                        er.put("toggleDinner", bool);
                        break;
                    default:
                        break;


                }

            }
        }

        keysValues.put("htl_id",hotelId);
        keysValues.remove("bsn_id");
        attributes.add("rm_type");
        attributes.add("rm_cost");
        attributes.remove("srv_type");
        attributes.remove("bsn_id");


        EntityResult erRooms = this.daoHelper.query(this.hotelRoomsDao,keysValues, attributes);

        ArrayList <String> roomTypeList = (ArrayList<String>) erRooms.get("rm_type");
        ArrayList <BigDecimal> roomCostList = (ArrayList<BigDecimal>) erRooms.get("rm_cost");

        if(roomTypeList!=null){
            for(int i = 0; i<roomTypeList.size(); i++){
                String roomType = roomTypeList.get(i);
                BigDecimal rCost = roomCostList.get(i);
                double roomCost = rCost.doubleValue();
                ArrayList <Double> arrayCoste = new ArrayList<>();
                arrayCoste.add(roomCost);

                switch (roomType){
                    case "Single":
                        er.put("roomTypeSingle",bool);
                        er.put("priceSingleRoom", arrayCoste);
                        break;
                    case "Double":
                        er.put("roomTypeDouble",bool);
                        er.put("priceDoubleRoom", arrayCoste);
                        break;
                    case "Triple":
                        er.put("roomTypeTriple",bool);
                        er.put("priceTripleRoom", arrayCoste);
                        break;

                }

            }

        }




        return er;



    }

    @Override
    public EntityResult hotelInsert(Map<String, Object> keysValues) throws OntimizeJEERuntimeException {
        return this.daoHelper.insert(this.hotelDao, keysValues);
    }

    @Override
    public EntityResult hotelUpdate(Map<String, Object> attributesValues, Map<String, Object> keysValues) throws OntimizeJEERuntimeException {
        return this.daoHelper.update(this.hotelDao, attributesValues, keysValues);
    }

    @Override
    public EntityResult hotelMultiUpdate(Map<String, Object> attributesValues, Map<String, Object> keysValues) throws OntimizeJEERuntimeException {

        int idHotel = (int) keysValues.get("htl_id");

        List <String> attributesRooms = new ArrayList<>();
        attributesRooms.add("rm_id");
        attributesRooms.add("rm_type");
        attributesRooms.add("rm_cost");




        Map<String, Object> mapaRooms = keysValues;
        mapaRooms.remove("bsn_id");

        EntityResult roomsEr =  this.daoHelper.query(this.hotelRoomsDao,mapaRooms, attributesRooms);

        List <Integer> idsRooms = (List<Integer>) roomsEr.get("rm_id");
        ArrayList <String> roomTypeList = (ArrayList<String>) roomsEr.get("rm_type");
        ArrayList <BigDecimal> roomCostList = (ArrayList<BigDecimal>) roomsEr.get("rm_cost");

        if(roomTypeList!=null){

            for(int i = 0; i<roomTypeList.size(); i++){
                int idRoom = idsRooms.get(i);
                String roomType = roomTypeList.get(i);

                Map <String, Object> mapSingleRoom = new HashMap<>();
                Map <String, Object> values = new HashMap<>();


                switch (roomType){
                    case "Single":
                        if( attributesValues.containsKey("priceSingleRoom") && attributesValues.get("priceSingleRoom").toString().equals("")){
                            mapSingleRoom.put("rm_id",idRoom);
                            this.daoHelper.delete(this.hotelRoomsDao, mapSingleRoom);
                        }else if(attributesValues.containsKey("priceSingleRoom") && !attributesValues.containsKey("roomTypeSingle")){
                            Float pricelist = (Float) attributesValues.get("priceSingleRoom");


                            mapSingleRoom.put("rm_id",idRoom);
                            values.put("rm_cost",pricelist);
                            this.daoHelper.update(this.hotelRoomsDao, values, mapSingleRoom);

                        }

                        break;
                    case "Double":
                        if( attributesValues.containsKey("priceDoubleRoom") && attributesValues.get("priceDoubleRoom").toString().equals("")){
                            mapSingleRoom.put("rm_id",idRoom);
                            this.daoHelper.delete(this.hotelRoomsDao, mapSingleRoom);
                        }else if(attributesValues.containsKey("priceDoubleRoom") && !attributesValues.containsKey("roomTypeDouble")){

                            Float pricelist = (Float) attributesValues.get("priceDoubleRoom");


                            mapSingleRoom.put("rm_id",idRoom);
                            values.put("rm_cost",pricelist);
                            this.daoHelper.update(this.hotelRoomsDao, values, mapSingleRoom);

                        }
                        break;
                    case "Triple":
                        if( attributesValues.containsKey("priceTripleRoom") && attributesValues.get("priceTripleRoom").toString().equals("")){
                            mapSingleRoom.put("rm_id",idRoom);
                            this.daoHelper.delete(this.hotelRoomsDao, mapSingleRoom);
                        }else if(attributesValues.containsKey("priceTripleRoom") && !attributesValues.containsKey("roomTypeTriple")){

                            Float pricelist = (Float) attributesValues.get("priceTripleRoom");


                            mapSingleRoom.put("rm_id",idRoom);
                            values.put("rm_cost",pricelist);
                            this.daoHelper.update(this.hotelRoomsDao, values, mapSingleRoom);

                        }
                        break;

                }

            }
        }



        if(attributesValues.containsKey("roomTypeSingle") && (boolean)attributesValues.get("roomTypeSingle")==true){

            Map <String,Object> mapaHotel = new HashMap<>();
            Float price = (Float) attributesValues.get("priceSingleRoom");
            mapaHotel.put("rm_type","Single");
            mapaHotel.put("rm_cost",price);
            mapaHotel.put("htl_id",idHotel);

            this.daoHelper.insert(this.hotelRoomsDao, mapaHotel);

        }

        if(attributesValues.containsKey("roomTypeDouble") && (boolean)attributesValues.get("roomTypeDouble")==true){

            Map <String,Object> mapaHotel = new HashMap<>();
            Float price = (Float) attributesValues.get("priceDoubleRoom");
            mapaHotel.put("rm_type","Double");
            mapaHotel.put("rm_cost",price);
            mapaHotel.put("htl_id",idHotel);


            this.daoHelper.insert(this.hotelRoomsDao, mapaHotel);

        }

        if(attributesValues.containsKey("roomTypeTriple") && (boolean)attributesValues.get("roomTypeTriple")==true){

            Map <String,Object> mapaHotel = new HashMap<>();
            Float price = (Float) attributesValues.get("priceTripleRoom");
            mapaHotel.put("rm_type","Triple");
            mapaHotel.put("rm_cost",price);
            mapaHotel.put("htl_id",idHotel);


            this.daoHelper.insert(this.hotelRoomsDao, mapaHotel);

        }

        /*
             ----------- TOGGLES --------------------
        */

        Map<String, Object> mapaServices = keysValues;
        mapaServices.remove("bsn_id");

        List <String> attributesServices = new ArrayList<>();
        attributesServices.add("srv_id");
        attributesServices.add("srv_type");

        EntityResult servicesEr =  this.daoHelper.query(this.hotelServicesDao,mapaServices, attributesServices);

        List <Integer> idsServices = (List<Integer>) servicesEr.get("srv_id");
        ArrayList <String> serviceTypeList = (ArrayList<String>) servicesEr.get("srv_type");

        if(serviceTypeList!=null) {

            for (int i = 0; i < serviceTypeList.size(); i++) {
                int idServ = idsServices.get(i);
                String srvType = serviceTypeList.get(i);

                Map<String, Object> mapSrv = new HashMap<>();


                switch (srvType) {
                    case "Wifi":
                        if (attributesValues.containsKey("toggleWifi") && (boolean) attributesValues.get("toggleWifi") == false) {
                            mapSrv.put("srv_id", idServ);
                            this.daoHelper.delete(this.hotelServicesDao, mapSrv);
                        }

                        break;
                    case "Parking":
                        if (attributesValues.containsKey("toggleParking") && (boolean) attributesValues.get("toggleParking") == false) {
                            mapSrv.put("srv_id", idServ);
                            this.daoHelper.delete(this.hotelServicesDao, mapSrv);
                        } else if (attributesValues.containsKey("toggleParking") && (boolean) attributesValues.get("toggleParking") == true && !serviceTypeList.contains("Parking")) {

                            mapSrv.put("srv_type", "Parking");
                            mapSrv.put("srv_cost", 0.0);
                            mapSrv.put("htl_id", idHotel);

                            this.daoHelper.insert(this.hotelServicesDao, mapSrv);

                        }

                        break;
                    case "Pool":
                        if (attributesValues.containsKey("togglePool") && (boolean) attributesValues.get("togglePool") == false) {
                            mapSrv.put("srv_id", idServ);
                            this.daoHelper.delete(this.hotelServicesDao, mapSrv);
                        } else if (attributesValues.containsKey("togglePool") && (boolean) attributesValues.get("togglePool") == true && !serviceTypeList.contains("Pool")) {

                            mapSrv.put("srv_type", "Pool");
                            mapSrv.put("srv_cost", 0.0);
                            mapSrv.put("htl_id", idHotel);

                            this.daoHelper.insert(this.hotelServicesDao, mapSrv);

                        }

                        break;
                    case "Breakfast":
                        if (attributesValues.containsKey("toggleBreakfast") && (boolean) attributesValues.get("toggleBreakfast") == false) {
                            mapSrv.put("srv_id", idServ);
                            this.daoHelper.delete(this.hotelServicesDao, mapSrv);
                        } else if (attributesValues.containsKey("toggleBreakfast") && (boolean) attributesValues.get("toggleBreakfast") == true && !serviceTypeList.contains("Breakfast")) {

                            mapSrv.put("srv_type", "Breakfast");
                            mapSrv.put("srv_cost", 0.0);
                            mapSrv.put("htl_id", idHotel);
                            this.daoHelper.insert(this.hotelServicesDao, mapSrv);

                        }

                        break;
                    case "Lunch":
                        if (attributesValues.containsKey("toggleLunch") && (boolean) attributesValues.get("toggleLunch") == false) {
                            mapSrv.put("srv_id", idServ);
                            this.daoHelper.delete(this.hotelServicesDao, mapSrv);
                        } else if (attributesValues.containsKey("toggleLunch") && (boolean) attributesValues.get("toggleLunch") == true && !serviceTypeList.contains("Lunch")) {

                            mapSrv.put("srv_type", "Lunch");
                            mapSrv.put("srv_cost", 0.0);
                            mapSrv.put("htl_id", idHotel);

                            this.daoHelper.insert(this.hotelServicesDao, mapSrv);

                        }

                        break;
                    case "Dinner":
                        if (attributesValues.containsKey("toggleDinner") && (boolean) attributesValues.get("toggleDinner") == false) {
                            mapSrv.put("srv_id", idServ);
                            this.daoHelper.delete(this.hotelServicesDao, mapSrv);
                        } else if (attributesValues.containsKey("toggleDinner") && (boolean) attributesValues.get("toggleDinner") == true && !serviceTypeList.contains("Dinner")) {

                            mapSrv.put("srv_type", "Dinner");
                            mapSrv.put("srv_cost", 0.0);
                            mapSrv.put("htl_id", idHotel);

                            this.daoHelper.insert(this.hotelServicesDao, mapSrv);

                        }

                        break;

                }

            }

            if (attributesValues.containsKey("toggleWifi") && (boolean) attributesValues.get("toggleWifi") == true && !serviceTypeList.contains("Wifi")) {
                Map<String, Object> mapSrv = new HashMap<>();

                mapSrv.put("srv_type", "Wifi");
                mapSrv.put("srv_cost", 0.0);
                mapSrv.put("htl_id", idHotel);

                this.daoHelper.insert(this.hotelServicesDao, mapSrv);

            }

            if (attributesValues.containsKey("toggleParking") && (boolean) attributesValues.get("toggleParking") == true && !serviceTypeList.contains("Parking")) {
                Map<String, Object> mapSrv = new HashMap<>();

                mapSrv.put("srv_type", "Parking");
                mapSrv.put("srv_cost", 0.0);
                mapSrv.put("htl_id", idHotel);

                this.daoHelper.insert(this.hotelServicesDao, mapSrv);

            }

            if (attributesValues.containsKey("togglePool") && (boolean) attributesValues.get("togglePool") == true && !serviceTypeList.contains("Pool")) {
                Map<String, Object> mapSrv = new HashMap<>();

                mapSrv.put("srv_type", "Pool");
                mapSrv.put("srv_cost", 0.0);
                mapSrv.put("htl_id", idHotel);

                this.daoHelper.insert(this.hotelServicesDao, mapSrv);

            }

            if (attributesValues.containsKey("toggleBreakfast") && (boolean) attributesValues.get("toggleBreakfast") == true && !serviceTypeList.contains("Breakfast")) {
                Map<String, Object> mapSrv = new HashMap<>();

                mapSrv.put("srv_type", "Breakfast");
                mapSrv.put("srv_cost", 0.0);
                mapSrv.put("htl_id", idHotel);

                this.daoHelper.insert(this.hotelServicesDao, mapSrv);

            }

            if (attributesValues.containsKey("toggleLunch") && (boolean) attributesValues.get("toggleLunch") == true && !serviceTypeList.contains("Lunch")) {
                Map<String, Object> mapSrv = new HashMap<>();

                mapSrv.put("srv_type", "Lunch");
                mapSrv.put("srv_cost", 0.0);
                mapSrv.put("htl_id", idHotel);

                this.daoHelper.insert(this.hotelServicesDao, mapSrv);

            }

            if (attributesValues.containsKey("toggleDinner") && (boolean) attributesValues.get("toggleDinner") == true && !serviceTypeList.contains("Dinner")) {
                Map<String, Object> mapSrv = new HashMap<>();

                mapSrv.put("srv_type", "Dinner");
                mapSrv.put("srv_cost", 0.0);
                mapSrv.put("htl_id", idHotel);

                this.daoHelper.insert(this.hotelServicesDao, mapSrv);

            }




        }


















        return roomsEr;
    }

    @Override
    public EntityResult hotelDelete(Map<String, Object> keysValues) throws OntimizeJEERuntimeException {
        return this.daoHelper.delete(this.hotelDao, keysValues);
    }

    /**
     * Process Services and Room hotel data
     *
     * @param dataMap Map with values
     */
    private void hotelServicesRoomsProcessor(Map<String, Object> dataMap) {
        if ((Boolean) dataMap.get("toggleWifi")) {
            insertHotelAttributes(dataMap, "Wifi");
        }else{

        }

        if ((Boolean) dataMap.get("toggleParking")) {
            insertHotelAttributes(dataMap, "Parking");
        }

        if ((Boolean) dataMap.get("togglePool")) {
            insertHotelAttributes(dataMap, "Pool");
        }

        if ((Boolean) dataMap.get("toggleBreakfast")) {
            insertHotelAttributes(dataMap, "Breakfast");
        }

        if ((Boolean) dataMap.get("toggleLunch")) {
            insertHotelAttributes(dataMap, "Lunch");
        }

        if ((Boolean) dataMap.get("toggleDinner")) {
            insertHotelAttributes(dataMap, "Dinner");
        }

        if ((Boolean) dataMap.get("roomTypeSingle")) {
            insertHotelRooms(dataMap, "Single", "priceSingleRoom");
        }

        if ((Boolean) dataMap.get("roomTypeDouble")) {
            insertHotelRooms(dataMap, "Double", "priceDoubleRoom");
        }

        if ((Boolean) dataMap.get("roomTypeTriple")) {
            insertHotelRooms(dataMap, "Triple", "priceTripleRoom");
        }
    }
    private void insertHotelRooms(Map<String, Object> dataMap, String roomType, String roomPrice) {
        dataMap.put(HotelRoomsDao.TYPE, roomType);
        dataMap.put(HotelRoomsDao.COST, dataMap.get(roomPrice));
        hotelRoomsService.hotelRoomsInsert(dataMap);
    }

    private void insertHotelAttributes(Map<String, Object> dataMap, String serviceType) {
        dataMap.put(HotelServicesDao.TYPE, serviceType);
        dataMap.put(HotelServicesDao.COST, 0.0);
        hotelServicesService.hotelServicesInsert(dataMap);
    }
}
