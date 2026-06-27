import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CreditCard,
  QrCode,
  Check,
  ChevronLeft,
  User,
  Phone,
  Mail,
  Briefcase,
} from 'lucide-react';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  playbookTitle: string;
  playbookPrice: number;
}

type Step = 'info' | 'payment' | 'success';
type PaymentTab = 'card' | 'qr';

interface FormErrors {
  [key: string]: string;
}

export default function PurchaseModal({
  isOpen,
  onClose,
  playbookTitle,
  playbookPrice,
}: PurchaseModalProps) {
  const [step, setStep] = useState<Step>('info');
  const [paymentTab, setPaymentTab] = useState<PaymentTab>('card');
  const [errors, setErrors] = useState<FormErrors>({});

  // Step 1: Info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [profession, setProfession] = useState('');

  // Step 2: Payment
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[\d\s\-+()]{7,20}$/.test(phone);

  const resetForm = useCallback(() => {
    setStep('info');
    setPaymentTab('card');
    setErrors({});
    setFullName('');
    setPhone('');
    setEmail('');
    setProfession('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setCardholderName('');
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const validateInfo = () => {
    const newErrors: FormErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(phone)) newErrors.phone = 'Invalid phone number';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email address';
    if (!profession.trim()) newErrors.profession = 'Profession is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors: FormErrors = {};
    if (paymentTab === 'card') {
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 16)
        newErrors.cardNumber = 'Valid card number is required';
      if (!expiry.trim() || !/^\d{2}\/\d{2}$/.test(expiry))
        newErrors.expiry = 'Valid expiry (MM/YY) required';
      if (!cvv.trim() || cvv.length < 3) newErrors.cvv = 'Valid CVV required';
      if (!cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateInfo()) {
      if (playbookPrice === 0) {
        setStep('success');
      } else {
        setStep('payment');
      }
    }
  };

  const handleComplete = () => {
    if (validatePayment()) {
      setStep('success');
    }
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    return digits;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          style={{ background: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[480px] max-h-[85vh] overflow-y-auto rounded-2xl p-6 md:p-8"
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 24px 64px rgba(108, 99, 255, 0.15)',
            }}
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors z-10"
            >
              <X className="w-4 h-4 text-[#4A5568]" />
            </button>

            {/* Step Indicator */}
            <div className="flex items-center gap-2 mb-6">
              {(playbookPrice === 0 ? ['info', 'success'] : ['info', 'payment', 'success'] as Step[]).map((s, i, arr) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ' +
                      (step === s
                        ? 'bg-accent-violet text-white'
                        : i < arr.indexOf(step)
                          ? 'bg-accent-teal text-white'
                          : 'bg-gray-200 text-gray-500')
                    }
                  >
                    {i < arr.indexOf(step) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < arr.length - 1 && <div className="w-8 h-0.5 bg-gray-200 rounded" />}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* STEP 1: Information */}
              {step === 'info' && (
                <motion.div
                  key="info"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-clash font-semibold text-2xl text-[#1A1A1A] mb-1">
                    Complete Your Purchase
                  </h2>
                  <p className="text-[#4A5568] text-sm mb-6">
                    {playbookTitle} — {playbookPrice === 0 ? 'Free' : `$${playbookPrice}`}
                  </p>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-medium text-[#4A5568] uppercase tracking-wider mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0AEC0]" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          className={
                            'w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all outline-none ' +
                            (errors.fullName
                              ? 'border-accent-rose focus:border-accent-rose focus:ring-2 focus:ring-accent-rose/20'
                              : 'border-gray-200 focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20')
                          }
                          style={{ background: 'rgba(255, 255, 255, 0.8)' }}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-accent-rose text-xs mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-medium text-[#4A5568] uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0AEC0]" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter your phone number"
                          className={
                            'w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all outline-none ' +
                            (errors.phone
                              ? 'border-accent-rose focus:border-accent-rose focus:ring-2 focus:ring-accent-rose/20'
                              : 'border-gray-200 focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20')
                          }
                          style={{ background: 'rgba(255, 255, 255, 0.8)' }}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-accent-rose text-xs mt-1">{errors.phone}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-[#4A5568] uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0AEC0]" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className={
                            'w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all outline-none ' +
                            (errors.email
                              ? 'border-accent-rose focus:border-accent-rose focus:ring-2 focus:ring-accent-rose/20'
                              : 'border-gray-200 focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20')
                          }
                          style={{ background: 'rgba(255, 255, 255, 0.8)' }}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-accent-rose text-xs mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Profession */}
                    <div>
                      <label className="block text-xs font-medium text-[#4A5568] uppercase tracking-wider mb-1.5">
                        Profession
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0AEC0]" />
                        <select
                          value={profession}
                          onChange={(e) => setProfession(e.target.value)}
                          className={
                            'w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all outline-none appearance-none ' +
                            (errors.profession
                              ? 'border-accent-rose focus:border-accent-rose focus:ring-2 focus:ring-accent-rose/20'
                              : 'border-gray-200 focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20')
                          }
                          style={{ background: 'rgba(255, 255, 255, 0.8)' }}
                        >
                          <option value="">Select your profession</option>
                          <option value="developer">Developer</option>
                          <option value="designer">Designer</option>
                          <option value="marketer">Marketer</option>
                          <option value="entrepreneur">Entrepreneur</option>
                          <option value="student">Student</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      {errors.profession && (
                        <p className="text-accent-rose text-xs mt-1">{errors.profession}</p>
                      )}
                    </div>

                    <button
                      onClick={handleContinue}
                      className="w-full bg-accent-violet text-white rounded-full py-3.5 font-medium text-sm transition-all hover:brightness-110 hover:scale-[1.02] mt-2"
                    >
                      {playbookPrice === 0 ? 'Download Playbook' : <>Continue to Payment &rarr;</>}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Payment */}
              {step === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={() => setStep('info')}
                    className="flex items-center gap-1 text-xs text-[#4A5568] hover:text-accent-violet transition-colors mb-4"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    Back
                  </button>

                  <h2 className="font-clash font-semibold text-2xl text-[#1A1A1A] mb-1">
                    Choose Payment Method
                  </h2>
                  <p className="text-[#4A5568] text-sm mb-6">
                    {playbookTitle} — {playbookPrice === 0 ? 'Free' : `$${playbookPrice}`}
                  </p>

                  {/* Tabs */}
                  <div className="flex gap-2 mb-6 p-1 rounded-xl bg-gray-100">
                    <button
                      onClick={() => setPaymentTab('card')}
                      className={
                        'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ' +
                        (paymentTab === 'card'
                          ? 'bg-white text-accent-violet shadow-sm'
                          : 'text-[#4A5568] hover:text-[#1A1A1A]')
                      }
                    >
                      <CreditCard className="w-4 h-4" />
                      Card Payment
                    </button>
                    <button
                      onClick={() => setPaymentTab('qr')}
                      className={
                        'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ' +
                        (paymentTab === 'qr'
                          ? 'bg-white text-accent-violet shadow-sm'
                          : 'text-[#4A5568] hover:text-[#1A1A1A]')
                      }
                    >
                      <QrCode className="w-4 h-4" />
                      QR Code
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {paymentTab === 'card' ? (
                      <motion.div
                        key="card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <div
                          className="p-4 rounded-xl border border-dashed border-gray-300 mb-4"
                          style={{ background: 'rgba(108, 99, 255, 0.03)' }}
                        >
                          <p className="text-xs text-[#4A5568] text-center">
                            Payment processing coming soon. Your information will be saved.
                          </p>
                        </div>

                        {/* Card Number */}
                        <div>
                          <label className="block text-xs font-medium text-[#4A5568] uppercase tracking-wider mb-1.5">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            placeholder="4242 4242 4242 4242"
                            maxLength={19}
                            className={
                              'w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none font-mono ' +
                              (errors.cardNumber
                                ? 'border-accent-rose focus:border-accent-rose focus:ring-2 focus:ring-accent-rose/20'
                                : 'border-gray-200 focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20')
                            }
                            style={{ background: 'rgba(255, 255, 255, 0.8)' }}
                          />
                          {errors.cardNumber && (
                            <p className="text-accent-rose text-xs mt-1">{errors.cardNumber}</p>
                          )}
                        </div>

                        {/* Expiry + CVV */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-[#4A5568] uppercase tracking-wider mb-1.5">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              value={expiry}
                              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                              placeholder="MM/YY"
                              maxLength={5}
                              className={
                                'w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none font-mono ' +
                                (errors.expiry
                                  ? 'border-accent-rose focus:border-accent-rose focus:ring-2 focus:ring-accent-rose/20'
                                  : 'border-gray-200 focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20')
                              }
                              style={{ background: 'rgba(255, 255, 255, 0.8)' }}
                            />
                            {errors.expiry && (
                              <p className="text-accent-rose text-xs mt-1">{errors.expiry}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-[#4A5568] uppercase tracking-wider mb-1.5">
                              CVV
                            </label>
                            <input
                              type="text"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                              placeholder="123"
                              maxLength={4}
                              className={
                                'w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none font-mono ' +
                                (errors.cvv
                                  ? 'border-accent-rose focus:border-accent-rose focus:ring-2 focus:ring-accent-rose/20'
                                  : 'border-gray-200 focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20')
                              }
                              style={{ background: 'rgba(255, 255, 255, 0.8)' }}
                            />
                            {errors.cvv && (
                              <p className="text-accent-rose text-xs mt-1">{errors.cvv}</p>
                            )}
                          </div>
                        </div>

                        {/* Cardholder */}
                        <div>
                          <label className="block text-xs font-medium text-[#4A5568] uppercase tracking-wider mb-1.5">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                            placeholder="Name as shown on card"
                            className={
                              'w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ' +
                              (errors.cardholderName
                                ? 'border-accent-rose focus:border-accent-rose focus:ring-2 focus:ring-accent-rose/20'
                                : 'border-gray-200 focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20')
                            }
                            style={{ background: 'rgba(255, 255, 255, 0.8)' }}
                          />
                          {errors.cardholderName && (
                            <p className="text-accent-rose text-xs mt-1">{errors.cardholderName}</p>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="qr"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col items-center"
                      >
                        <div
                          className="w-48 h-48 rounded-2xl flex flex-col items-center justify-center gap-3 mb-4"
                          style={{
                            background: 'linear-gradient(135deg, #6C63FF 0%, #00BFA6 100%)',
                            boxShadow: '0 8px 32px rgba(108, 99, 255, 0.25)',
                          }}
                        >
                          <QrCode className="w-20 h-20 text-white" />
                        </div>
                        <p className="text-sm font-medium text-[#1A1A1A] mb-1">Scan to Pay</p>
                        <p className="text-xs text-[#4A5568] mb-4">PhonePe integration coming soon</p>
                        <div
                          className="w-full p-3 rounded-xl border border-dashed border-gray-300"
                          style={{ background: 'rgba(108, 99, 255, 0.03)' }}
                        >
                          <p className="text-xs text-[#4A5568] text-center">
                            Payment processing coming soon. Your information will be saved.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Order Summary */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-[#4A5568]">Total</span>
                      <span className="font-clash font-semibold text-xl text-[#1A1A1A]">
                        {playbookPrice === 0 ? 'Free' : `$${playbookPrice}`}
                      </span>
                    </div>
                    <button
                      onClick={handleComplete}
                      className="w-full bg-accent-violet text-white rounded-full py-3.5 font-medium text-sm transition-all hover:brightness-110 hover:scale-[1.02]"
                    >
                      {playbookPrice === 0 ? 'Download Playbook' : 'Complete Purchase'}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Success */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                  }}
                  className="flex flex-col items-center text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-20 h-20 rounded-full bg-accent-teal flex items-center justify-center mb-6"
                  >
                    <motion.div
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                    >
                      <Check className="w-10 h-10 text-white" />
                    </motion.div>
                  </motion.div>

                  <h2 className="font-clash font-semibold text-2xl text-[#1A1A1A] mb-2">
                    {playbookPrice === 0 ? 'Download Successful!' : 'Purchase Successful!'}
                  </h2>
                  <p className="text-[#4A5568] text-sm mb-2 max-w-[300px]">
                    Your playbook will be sent to{' '}
                    <span className="font-medium text-[#1A1A1A]">{email || 'your email'}</span>{' '}
                    shortly.
                  </p>
                  <p className="text-xs text-[#A0AEC0] mb-8">
                    Order confirmation included
                  </p>

                  <button
                    onClick={handleClose}
                    className="bg-transparent border-2 border-accent-violet text-accent-violet rounded-full px-8 py-3 font-medium text-sm transition-all hover:bg-accent-violet hover:text-white"
                  >
                    Browse More Playbooks
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
