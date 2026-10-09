import { permanentRedirect } from 'next/navigation';

/** Legacy /features path — permanently consolidated onto /editorial. */
export default function FeaturesRedirect() {
  permanentRedirect('/editorial');
}
