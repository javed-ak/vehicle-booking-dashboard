const Footer = () => {
    return (
        <div className="h-90 bg-zinc-900 p-10 text-slate-50 text-center">
            <h1 className='font-semibold text-lg '>Offering professional and luxurious chauffeur-driver vehicles for all your travel needs.</h1>
            <div className='grid grid-cols-3 my-8'>
                <div className='flex flex-col gap-2 '>
                    <div>
                        <h2 className='font-bold'>Address</h2>
                        <p>2750 FM 1463 Rd.</p>
                        <p> STE 105-155, Katy, TX 77494.</p>
                    </div>

                    <div>
                        <h2 className='font-bold'>Working hours</h2>
                        <p>Mon-Fri: 09:00 - 16:00</p>
                        <p>Sat & Sun: Closed</p>
                        <p>Call Our Office</p>
                        <p>+1 (657) 389-3470</p>
                    </div>
                </div>

                <div>
                    <h2 className='font-bold text-md mb-2'>Quick Links</h2>
                    <ul className='underline  flex flex-col gap-2'>
                        <li><a href="our-fleet.html">Our Fleet</a></li>
                        <li><a href="pricing.html">Pricing</a></li>
                        <li><a href="book-the-vehicle.html">Book the Vehicle</a></li>
                        <li><a href="#">Submit a Review</a></li>
                        <li><a href="faq.html">FAQs</a></li>
                    </ul>
                </div>

                <div>
                    <h2 className="font-bold text-md mb-2">Follow Us</h2>
                    <ul className="underline flex flex-col gap-2">
                        <li><a href="#">Facebook</a></li>
                        <li><a href="#">Instagram</a></li>
                        <li><a href="#">Twitter</a></li>
                        <li><a href="#">Yelp</a></li>
                        <li><a href="#">WhatsApp</a></li>
                    </ul>
                </div>
            </div>
            <h2>
                © 2025 Black Vans Transportation. All Rights Reserved. Website Designed by <a className="underline" href="https://abedimarketingsolutions.net/" target="_blank">Abedi Marketing Solutions.</a>
            </h2>
        </div>
    )
}

export default Footer