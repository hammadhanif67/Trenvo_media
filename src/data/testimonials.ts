/* ---------------------------------------------------------------------------
   TESTIMONIALS — master.md §2.8, §19.2, §20.3

   Empty, deliberately.

   The design reference for this section carried three five-star reviews from
   "Sarah J.", "Mark T." and "Ali R.", one of them claiming a 203% lift in 90
   days. Those people do not exist. §2.8 forbids fabricated proof, the standing
   instruction on this project forbids it, and a review invented by the company
   being reviewed is the most damaging thing that could sit on this page.

   The section renders an honest note while this array is empty (see
   sections/home/Testimonials.tsx) and fills itself the moment a real entry is
   added here.

   WHAT A REAL ENTRY REQUIRES, before it goes in:
     · the person's actual name and role
     · the company, named
     · their explicit permission to publish it
     · a quote they actually said or signed off

   No star ratings. Stars are an aggregate-rating signal and imply a review
   platform standing behind them; there is none, so the component does not
   render them at all.
--------------------------------------------------------------------------- */

export interface Testimonial {
  id: string;
  quote: string;
  /** Real name. Not an initial, not a role used as a name. */
  name: string;
  /** Role and company, as the person would write it themselves. */
  role: string;
}

export const TESTIMONIALS: Testimonial[] = [];
