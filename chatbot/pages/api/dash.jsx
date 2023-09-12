import React, { useEffect, useRef, useState } from 'react'
import './AdminDashboardBooking.css'
import NextArrow from "../../../../assets/img/back_arrow_right.png";
import { Tab, Tabs, Dropdown } from 'react-bootstrap';
import { IMG_ALT } from "../../../../constants"
import { useDispatch } from 'react-redux';
import { getBookings } from '../../../../redux/actions/booking';
import { useSelector } from 'react-redux';
import moment from 'moment';
import ReactPaginate from 'react-paginate';

function Items({ currentItems, setBookingSidebarDetail, onOpenAdminBookingDetailSidebar }) {

    return (
        <>
            {currentItems &&
                currentItems.map((item, index) => (
                    <div key={index} onClick={() => { setBookingSidebarDetail(item); onOpenAdminBookingDetailSidebar() }} className={currentItems.length == 1 ? "clt_admin_dash_booking_container_wrapper" : index == 0 ? "clt_admin_dash_booking_container_wrapper_first" : (index + 1) == currentItems?.length ? "clt_admin_dash_booking_container_wrapper_last" : "clt_admin_dash_booking_container_wrapper_center"}>
                        <div className="clt_admin_dash_booking_container_box">
                            <div className='clt_admin_dash_booking_avatar_wrapper'>
                                {item?.User?.profilePictureUrl ?
                                    <div className="clt_admin_dash_booking_image">
                                        <img src={item?.User?.profilePictureUrl} alt={item?.User?.firstName} />
                                    </div>
                                    :
                                    <div className="clt_admin_dash_booking_avatar">
                                        <div className='clt_admin_dash_booking_avatar_name'>{item?.User?.firstName[0].toUpperCase()}</div>
                                    </div>
                                }
                            </div>
                            <div className="clt_admin_dash_booking_container_detail">
                                <div className="clt_admin_dash_booking_container_box_name">{item?.User?.firstName} {item?.User?.lastName}</div>
                                <div className="subtitle">{moment(item?.ChildTimeSlot?.startDate).format("DD-MM-YY")} {item?.ChildTimeSlot?.startHour} {'➔ '}</div>
                                <div className="subtitle2"> {moment(item?.ChildTimeSlot?.endDate).format("DD-MM-YY")} {item?.ChildTimeSlot?.endHour}</div>

                                <div className="event" style={{ color: `${item?.Event?.color}`, backgroundColor: `${item?.Event?.background}30` }}>{item?.Event?.title}</div>
                            </div>
                            <div className="clt_admin_dash_booking_container_arrow">
                                <img src={NextArrow} className="clt_admin_arrow" alt={IMG_ALT} />
                            </div>
                        </div>
                    </div>
                ))}
        </>
    );
}
/* Const */
const AdminDashboardBooking = () => {

    /* Const - Sidebar - Booking Detail */

    const [isOpenSidebarBookingAdmin, setisOpenSidebarBookingAdmin] = useState(false);
    const onOpenAdminBookingDetailSidebar = () => {
        setisOpenSidebarBookingAdmin(true)
    }
    /* Const - Navigation bar - Booking or request */
    const [activeTab, setActiveTab] = useState("booking");
    const [eventFilter, setEventFilter] = useState('All events');
    const [bookingFilterType, setBookingFilterType] = useState('comming');
    const [bookingFilterList, setBookingFilterList] = useState([]);
    const allEvents = useSelector((state) => state.allEvents.events);
    /* Const - Navigation - Booking - Filter button : Order state / Event type  */
    const CustomToggleFirst = React.forwardRef(({ children, onClick }, ref) => (
        <p className="clt_admin_dash_booking_filter_chip"
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
                console.log(e);
            }}
        >
            {children}
            {eventFilter}
            <img src={NextArrow} className="clt_admin_arrow down" alt={IMG_ALT} />
        </p>
    ));

    const CustomToggleSecond = React.forwardRef(({ children, onClick }, ref) => (
        <p className="clt_admin_dash_booking_filter_chip"
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
                console.log(e);
            }}
        >
            {children}
            {bookingFilterType}
            <img src={NextArrow} className="clt_admin_arrow down" alt={IMG_ALT} />
        </p>
    ));

    /* Const - Navigation - Request - Request Counter */
    const [requestCounter, setRequestCounter] = useState(0)
    const bookings = useSelector(state => state.bookings.allBookings);

    console.log("bookings", bookings);

    const [bookingSidebarDetail, setBookingSidebarDetail] = useState([]);
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getBookings())
        handleBookingFilter('comming')
    }, [])


    useEffect(() => {
        handleBookingFilter('comming')
    }, [bookings])

    const handleBookingFilter = (type) => {
        const list = bookings?.filter(list => list?.status == type)
        setBookingFilterList(list)
        setBookingFilterType(type)
    }

    const itemsPerPage = 5
    const [itemOffset, setItemOffset] = useState(0);

    const endOffset = itemOffset + itemsPerPage;

    const currentItems = bookingFilterList?.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(bookingFilterList?.length / itemsPerPage);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % bookingFilterList?.length;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
    };
    /* Screen */
    return (
        <div className='d-flex w-100 flex-column justify-center align-items-center relative'>
            <div className="clt_admin_dash_booking_container_outer_wrapper ">
                <div className="clt_admin_dash_booking_container">
                    {/* Section - Navigation bar */}
                    <Tabs
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                        className="clt-admin-booking-tabs"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example"
                        onOverflow={"scroll"}
                    >

                        {/* Navigation - Booking */}
                        <Tab
                            eventKey="booking"
                            title="Booking"
                            className="clt-admin-booking-tabs-body ctl_admin_search_container"
                        >

                            <h2 className="clt-admin-booking-section-3-h2">Booking</h2>

                            {/* Section - Button filter */}
                            <div className="clt_admin_dash_booking_filter_chip_container">

                                <Dropdown>
                                    <Dropdown.Toggle as={CustomToggleFirst} />
                                    <Dropdown.Menu
                                        size="sm"
                                        title=""
                                        className="pfr_dropdown_menu"
                                    >
                                        <Dropdown.Item
                                            className="pfr_payment_cards3dots_options"
                                            onClick={() => setEventFilter('All events')}
                                        >
                                            All events
                                        </Dropdown.Item>
                                        {allEvents?.filter(x => (x.isActive === true)).map((event, index) => (
                                            <Dropdown.Item
                                                key={index}
                                                onClick={() => setEventFilter(event.title)}
                                                className="pfr_payment_cards3dots_options"
                                            >
                                                {event.title}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>

                                <Dropdown>
                                    <Dropdown.Toggle as={CustomToggleSecond} />
                                    <Dropdown.Menu
                                        size="sm"
                                        title=""
                                        className="pfr_dropdown_menu"
                                    >
                                        <Dropdown.Item
                                            className="pfr_payment_cards3dots_options"
                                            onClick={() => handleBookingFilter('comming')}
                                        >
                                            Coming
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            className="pfr_payment_cards3dots_options"
                                            onClick={() => handleBookingFilter('Ongoing')}
                                        >
                                            Ongoing
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            className="pfr_payment_cards3dots_options"
                                            onClick={() => handleBookingFilter('Finish')}
                                        >
                                            Finish
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            className="pfr_payment_cards3dots_options"
                                            onClick={() => handleBookingFilter('Cancel')}
                                        >
                                            Cancel
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>


                            </div>

                            {/* Section - Booking list */}
                            <div>
                                {/*<p className="clt_admin_dash_menu_container_name4">COMING</p>*/}

                                <Items currentItems={currentItems} setBookingSidebarDetail={setBookingSidebarDetail} onOpenAdminBookingDetailSidebar={onOpenAdminBookingDetailSidebar} />
                                <div className='mt-3'>
                                    <ReactPaginate
                                        breakLabel="..."
                                        nextLabel=">"
                                        onPageChange={handlePageClick}
                                        pageRangeDisplayed={5}
                                        pageCount={pageCount}
                                        previousLabel="<"
                                        renderOnZeroPageCount={null}
                                        pageClassName="page-item"
                                        pageLinkClassName="page-link"
                                        previousClassName="page-item"
                                        previousLinkClassName="page-link"
                                        nextClassName="page-item"
                                        nextLinkClassName="page-link"
                                        // breakLabel="..."
                                        breakClassName="page-item"
                                        breakLinkClassName="page-link"
                                        containerClassName="pagination"
                                        activeClassName="active"
                                    />
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboardBooking
